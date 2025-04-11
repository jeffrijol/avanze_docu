
import type { APIRoute } from "astro";
import { supabase } from "../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const action = request.url.split("/").pop();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return redirect("/login?error=Credenciales+inválidas");
  }

  try {
    const { data, error } = action === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) throw error;

    cookies.set("sb-access-token", data.session?.access_token!, {
      path: "/",
      httpOnly: true,
      secure: true,
    });

    cookies.set("sb-refresh-token", data.session?.refresh_token!, {
      path: "/",
      httpOnly: true,
      secure: true,
    });

    return redirect("/docs");
  } catch (error) {
    return redirect(`/${action}?error=${encodeURIComponent((error as Error).message)}`);
  }
};