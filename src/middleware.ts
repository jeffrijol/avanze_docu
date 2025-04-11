import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async ({ locals, cookies, request }, next) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (accessToken && refreshToken) {
    const { data: { user }, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });
 
    locals.user = user ?? null;
  }

  // Proteger rutas autenticadas
  const protectedPaths = ["/docs"];
  const url = new URL(request.url);
  
  if (protectedPaths.some(path => url.pathname.startsWith(path)) && !locals.user) {
    return Response.redirect(new URL("/login", request.url));
  }

  return next();
});