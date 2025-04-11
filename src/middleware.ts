import { supabase } from "../src/lib/supabase.js"; 

import { defineMiddleware } from "astro:middleware";
import type { User } from "@supabase/supabase-js"; // Tipo de Auth

export const onRequest = defineMiddleware(async ({ locals, cookies, request },next) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  locals.user = null;

  if (accessToken && refreshToken) {
    const { data: { user }, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (user) locals.user = user; // ¡Sin necesidad de casteo!
  }

  // Redirigir si no está autenticado
  const url = new URL(request.url);
  if (url.pathname.startsWith("/docs") && !locals.user) {
    return Response.redirect(new URL("/login", url.origin));
  }

  return next();
});