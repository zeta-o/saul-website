"use server";

import { EMAIL_RE } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

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
