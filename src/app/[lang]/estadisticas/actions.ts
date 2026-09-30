"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, EMAIL_RE, hasLocale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type SolicitudInput = {
  nombre: string;
  correo: string;
  rol: string;
  social: string;
  updates: boolean;
  /** Campo trampa: los humanos no lo ven ni lo llenan. */
  website?: string;
};

export type SolicitudResult = { ok: true } | { ok: false; error: "nombre" | "correo" | "servidor" };

export async function solicitarAcceso(input: SolicitudInput): Promise<SolicitudResult> {
  const nombre = input.nombre.trim().slice(0, 200);
  const correo = input.correo.trim().toLowerCase().slice(0, 320);
  if (!nombre) return { ok: false, error: "nombre" };
  if (!EMAIL_RE.test(correo)) return { ok: false, error: "correo" };
  // Bot: fingir éxito sin guardar.
  if (input.website) return { ok: true };
  if (!isSupabaseConfigured) return { ok: true };

  const social = input.social.trim().slice(0, 500);
  const { error } = await createPublicClient()
    .from("access_requests")
    .insert({
      nombre,
      correo,
      rol: input.rol.trim().slice(0, 200),
      social_url: /^https?:\/\//i.test(social) || !social ? social : `https://${social}`,
      acepta_actualizaciones: input.updates,
    });
  if (error) {
    console.error("access_requests insert:", error.message);
    return { ok: false, error: "servidor" };
  }
  return { ok: true };
}

// ─── Login de entrenadores con acceso (código o enlace por correo) ─────────────

export type LoginError = "correo" | "codigo" | "sinAcceso" | "limite" | "servidor";
export type LoginResult = { error?: LoginError; enviado?: boolean };

const paginaStats = (lang: string) => `/${hasLocale(lang) ? lang : defaultLocale}/estadisticas`;

/**
 * Paso 1: enviar el código. Solo se envía a correos con acceso (o admins), pero la
 * respuesta es la misma para no revelar quién lo tiene.
 */
export async function enviarCodigoStats(correoRaw: string, lang: string): Promise<LoginResult> {
  const correo = correoRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(correo)) return { error: "correo" };
  if (!isSupabaseConfigured) return { error: "servidor" };

  const supabase = await createClient();
  const { data: tieneAcceso } = await supabase.rpc("is_allowed_email", { p_email: correo });
  if (tieneAcceso) {
    // Si el correo trae un enlace en vez del código (plantilla por defecto), vuelve a .../confirmar.
    const origen = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { shouldCreateUser: true, emailRedirectTo: origen ? `${origen}${paginaStats(lang)}/confirmar` : undefined },
    });
    if (error) {
      console.error("signInWithOtp (estadísticas):", error.message);
      if (error.status === 429) return { error: "limite" };
    }
  }
  return { enviado: true };
}

/** Paso 2: verificar el código y abrir sesión. */
export async function verificarCodigoStats(correoRaw: string, codigoRaw: string, lang: string): Promise<LoginResult> {
  const correo = correoRaw.trim().toLowerCase();
  const token = codigoRaw.replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) return { error: "codigo", enviado: true };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email: correo, token, type: "email" });
  if (error) return { error: "codigo", enviado: true };

  const { data: tieneAcceso } = await supabase.rpc("is_allowed");
  if (!tieneAcceso) {
    await supabase.auth.signOut();
    return { error: "sinAcceso" };
  }
  redirect(paginaStats(lang));
}

export async function cerrarSesionStats(lang: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(paginaStats(lang));
}
