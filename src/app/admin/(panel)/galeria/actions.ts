"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { errorMsg, removeMedia, revalidarPublico, texto, type ActionResult } from "@/lib/admin/common";
import type { Disciplina } from "@/lib/data/types";

export type FotoInput = {
  id?: string;
  disciplina: Disciplina;
  image_path: string | null;
  descripcion_es: string;
  descripcion_en: string;
  fotografo_handle: string;
  fotografo_url: string;
  publicado: boolean;
};

export async function guardarFoto(input: FotoInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (input.disciplina !== "ruta" && input.disciplina !== "montana") return { ok: false, error: "Disciplina inválida." };
  const descripcion_es = texto(input.descripcion_es, 300);
  if (!descripcion_es) return { ok: false, error: "Escribe la descripción en español." };

  const url = texto(input.fotografo_url, 500);
  const row = {
    disciplina: input.disciplina,
    image_path: input.image_path,
    descripcion_es,
    descripcion_en: texto(input.descripcion_en, 300),
    fotografo_handle: texto(input.fotografo_handle, 100),
    fotografo_url: url && !/^https?:\/\//i.test(url) ? `https://${url}` : url,
    publicado: input.publicado,
  };

  if (input.id) {
    const { data: previa } = await supabase.from("gallery_items").select("image_path").eq("id", input.id).single();
    const { error } = await supabase.from("gallery_items").update(row).eq("id", input.id);
    if (error) return { ok: false, error: errorMsg(error) };
    if (previa?.image_path && previa.image_path !== row.image_path) await removeMedia(supabase, [previa.image_path]);
  } else {
    // Al final de su disciplina
    const { data: ultima } = await supabase
      .from("gallery_items")
      .select("orden")
      .eq("disciplina", row.disciplina)
      .order("orden", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase.from("gallery_items").insert({ ...row, orden: (ultima?.orden ?? 0) + 10 });
    if (error) return { ok: false, error: errorMsg(error) };
  }
  revalidarPublico("galeria");
  return { ok: true };
}

export async function eliminarFoto(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("gallery_items").delete().eq("id", id).select("image_path").single();
  if (error) return { ok: false, error: errorMsg(error, "No se pudo eliminar.") };
  await removeMedia(supabase, [data.image_path]);
  revalidarPublico("galeria");
  return { ok: true };
}

/** Intercambia el orden con la foto vecina de la misma disciplina. */
export async function moverFoto(id: string, direccion: -1 | 1): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: actual } = await supabase.from("gallery_items").select("id, disciplina, orden").eq("id", id).single();
  if (!actual) return { ok: false, error: "No existe." };
  const { data: vecina } = await supabase
    .from("gallery_items")
    .select("id, orden")
    .eq("disciplina", actual.disciplina)
    .filter("orden", direccion < 0 ? "lt" : "gt", actual.orden)
    .order("orden", { ascending: direccion > 0 })
    .limit(1)
    .maybeSingle();
  if (!vecina) return { ok: true };
  const a = await supabase.from("gallery_items").update({ orden: vecina.orden }).eq("id", actual.id);
  const b = await supabase.from("gallery_items").update({ orden: actual.orden }).eq("id", vecina.id);
  if (a.error || b.error) return { ok: false, error: errorMsg(a.error ?? b.error) };
  revalidarPublico("galeria");
  return { ok: true };
}
