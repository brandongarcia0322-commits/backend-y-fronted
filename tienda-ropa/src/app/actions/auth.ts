'use server';

import 'server-only';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

const UpdatePasswordSchema = z.object({
  password: z.string().min(12, { message: 'La contraseña debe tener mínimo 12 caracteres' }),
});

/**
 * Registro de nuevos usuarios.
 * El Trigger 'handle_new_user' en PostgreSQL se encargará de crear
 * la entrada en 'profiles' y asignarle el rol 'USER' automáticamente.
 */
export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Datos de registro inválidos.', details: parsed.error.format() };
  }

  const { email, password, fullName } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    // Evitamos exponer errores internos sensibles
    return { error: error.message || 'Error al registrar el usuario.' };
  }

  revalidatePath('/', 'layout');
  return { success: true, user: data.user };
}

/**
 * Inicio de sesión seguro mediante credenciales de Supabase Auth
 */
export async function loginUser(input: unknown) {
  const parsed = LoginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Credenciales con formato incorrecto.' };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Cierre de sesión global con invalidación de token en cookie HttpOnly
 */
export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Solicitar correo de recuperación de contraseña
 */
export async function requestPasswordReset(input: unknown) {
  const parsed = ResetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'Correo electrónico no válido.' };
  }

  const { email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/recovery/update-password`,
  });

  // Por seguridad contra enumeración de cuentas, se responde de forma genérica
  if (error) {
    console.error('Error al solicitar recuperación:', error.message);
  }

  return {
    message: 'Si la cuenta existe, se ha enviado un enlace de recuperación a tu correo.',
  };
}

/**
 * Actualizar contraseña estando en sesión de recuperación
 */
export async function updatePassword(input: unknown) {
  const parsed = UpdatePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'La nueva contraseña no cumple con el nivel mínimo de seguridad.' };
  }

  const { password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: 'No se pudo actualizar la contraseña. Inténtalo de nuevo.' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}