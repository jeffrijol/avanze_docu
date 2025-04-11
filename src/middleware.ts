import { defineMiddleware } from "astro:middleware";
import { supabase } from "@lib/supabase"; // Usando alias configurado
import type { User } from "@supabase/supabase-js";

export const onRequest = defineMiddleware(async ({ locals, cookies, request, redirect }, next ) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  // Resetear el usuario en cada request
  locals.user = null;

  // Intentar recuperar la sesión
  if (accessToken?.value && refreshToken?.value) {
    const { data: { user }, error } = await supabase.auth.setSession({
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
    });

    if (!error && user) {
      locals.user = user; // Tipo User de @supabase/supabase-js
    }
  }

  // Redirigir si la ruta está protegida y no hay usuario
  const protectedPaths = ["/docs"];
  const url = new URL(request.url);
  
  if (protectedPaths.some(path => url.pathname.startsWith(path)) && !locals.user) {
    return redirect("/login");
  }

  return await next();
});