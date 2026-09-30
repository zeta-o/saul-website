"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { errorMsg, texto, type ActionResult } from "@/lib/admin/common";
import { EMAIL_RE } from "@/lib/i18n";

const refrescar = () => revalidatePath("/admin", "layout");

export async function aprobarSolicitud(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: s, error } = await supabase.from("access_requests").select("*").eq("id", id).single();
  if (error || !s) return { ok: false, error: "La solicitud no existe." };

  const { error: e1 } = await supabase.from("allowed_emails").upsert({
    email: s.correo.toLowerCase(),
    nombre: s.nombre,
    acepta_actualizaciones: s.acepta_actualizaciones,
    request_id: s.id,
  });
  if (e1) return { ok: false, error: errorMsg(e1) };
  const { error: e2 } = await supabase
    .from("access_requests")
    .update({ estado: "aprobada", decidido_at: new Date().toISOString() })
    .eq("id", id);
  if (e2) return { ok: false, error: errorMsg(e2) };
  refrescar();
  return { ok: true };
}

export async function rechazarSolicitud(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("access_requests")
    .update({ estado: "rechazada", decidido_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: errorMsg(error) };
  refrescar();
  return { ok: true };
}

/** Vuelve a dejar una solicitud rechazada como pendiente. */
export async function reabrirSolicitud(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("access_requests").update({ estado: "pendiente", decidido_at: null }).eq("id", id);
  if (error) return { ok: false, error: errorMsg(error) };
  refrescar();
  return { ok: true };
}

export async function revocarAcceso(email: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("allowed_emails").delete().eq("email", email).select("request_id").single();
  if (error) return { ok: false, error: errorMsg(error, "No se pudo revocar.") };
  if (data.request_id) {
    await supabase
      .from("access_requests")
      .update({ estado: "rechazada", decidido_at: new Date().toISOString() })
      .eq("id", data.request_id);
  }
  refrescar();
  return { ok: true };
}

/** Dar acceso directamente, sin solicitud previa. */
export async function agregarAcceso(emailRaw: string, nombreRaw: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Escribe un correo válido." };
  const { error } = await supabase.from("allowed_emails").insert({ email, nombre: texto(nombreRaw, 200) });
  if (error) return { ok: false, error: error.code === "23505" ? "Ese correo ya tiene acceso." : errorMsg(error) };
  refrescar();
  return { ok: true };
}
