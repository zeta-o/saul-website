"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { EMAIL_RE } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; enviado?: boolean; correo?: string };

/**
 * Paso 1: enviar el código. Solo se envía a correos de administradores,
 * pero la respuesta es la misma para no revelar quién lo es.
 */
export async function enviarCodigo(correoRaw: string): Promise<LoginState> {
  const correo = correoRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(correo)) return { error: "Escribe un correo válido." };
  if (!isSupabaseConfigured) return { error: "Supabase no está configurado (faltan variables de entorno)." };

  const supabase = await createClient();
  const { data: esAdmin } = await supabase.rpc("is_admin_email", { p_email: correo });
  if (esAdmin) {
    // Si el correo trae un enlace en vez del código (plantilla por defecto), vuelve a /admin/confirmar.
    const origen = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { shouldCreateUser: true, emailRedirectTo: origen ? `${origen}/admin/confirmar` : undefined },
    });
    if (error) {
      console.error("signInWithOtp:", error.message);
      if (error.status === 429) return { error: "Demasiados intentos. Espera un minuto y vuelve a intentarlo." };
    }
  }
  return { enviado: true, correo };
}

/** Paso 2: verificar el código y abrir sesión. */
export async function verificarCodigo(correoRaw: string, codigoRaw: string): Promise<LoginState> {
  const correo = correoRaw.trim().toLowerCase();
  const token = codigoRaw.replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) return { error: "El código tiene 6 dígitos.", enviado: true, correo };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email: correo, token, type: "email" });
  if (error) return { error: "Código incorrecto o vencido.", enviado: true, correo };

  const { data: esAdmin } = await supabase.rpc("is_admin");
  if (!esAdmin) {
    await supabase.auth.signOut();
    return { error: "Este correo no tiene acceso al admin." };
  }
  redirect("/admin");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
