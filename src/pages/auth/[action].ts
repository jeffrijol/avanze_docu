import { supabase } from '../../lib/supabase';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const action = new URL(request.url).pathname.split('/').pop();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return new Response('Faltan credenciales', { status: 400 });
  }

  try {
    let userData;
    
    switch (action) {
      case 'signin':
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        userData = signInData;
        break;

      case 'signup':
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        userData = signUpData;
        break;

      default:
        return new Response('Acción no válida', { status: 400 });
    }

    // Configurar cookies de sesión
    if (userData.session) {
      cookies.set('sb-access-token', userData.session.access_token, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      });

      cookies.set('sb-refresh-token', userData.session.refresh_token, {
        path: '/',
        secure: true,
        httpOnly: true,
      });
    }

    return redirect('/docs');

  } catch (error) {
    return redirect(`/${action}?error=${encodeURIComponent(error instanceof Error ? error.message : 'Error desconocido')}`);
  }
};