"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { errorMsg, removeMedia, revalidarPublico, texto, type ActionResult } from "@/lib/admin/common";
import type { HistoryYearRow } from "@/lib/data/types";

export type AnoInput = Omit<HistoryYearRow, "orden"> & { id?: string };

const lineas = (v: string[]) => v.map((l) => l.trim()).filter(Boolean).slice(0, 30);

export async function guardarAno(input: AnoInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();
  const label_es = texto(input.label_es, 40);
  if (!label_es) return { ok: false, error: "Escribe el nombre del año (ej. 2028)." };

  const row = {
    label_es,
    label_en: texto(input.label_en, 40) || label_es,
    titulo_es: texto(input.titulo_es, 200),
    titulo_en: texto(input.titulo_en, 200),
    cuerpo_es: texto(input.cuerpo_es, 20000),
    cuerpo_en: texto(input.cuerpo_en, 20000),
    cierre_es: texto(input.cierre_es, 200),
    cierre_en: texto(input.cierre_en, 200),
    logros_es: lineas(input.logros_es),
    logros_en: lineas(input.logros_en),
    video_path: input.video_path || null,
    fotos: input.fotos.filter(Boolean).slice(0, 3),
    inicial: input.inicial,
    publicado: input.publicado ?? true,
  };

  // Solo un año puede ser el inicial.
  if (row.inicial) {
    const q = supabase.from("history_years").update({ inicial: false }).eq("inicial", true);
    const { error } = await (input.id ? q.neq("id", input.id) : q);
    if (error) return { ok: false, error: errorMsg(error) };
  }

  let id = input.id;
  if (id) {
    const { data: previo } = await supabase.from("history_years").select("video_path, fotos").eq("id", id).single();
    const { error } = await supabase.from("history_years").update(row).eq("id", id);
    if (error) return { ok: false, error: errorMsg(error) };
    if (previo) {
      const quitados = [previo.video_path, ...previo.fotos].filter(
        (p) => p && p !== row.video_path && !row.fotos.includes(p)
      );
      await removeMedia(supabase, quitados);
    }
  } else {
    const { data: ultimo } = await supabase
      .from("history_years")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("history_years")
      .insert({ ...row, orden: (ultimo?.orden ?? 0) + 10 })
      .select("id")
      .single();
    if (error) return { ok: false, error: errorMsg(error) };
    id = data.id;
  }
  revalidarPublico("historia");
  return { ok: true, data: { id: id! } };
}

export async function eliminarAno(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("history_years")
    .delete()
    .eq("id", id)
    .select("video_path, fotos")
    .single();
  if (error) return { ok: false, error: errorMsg(error, "No se pudo eliminar.") };
  await removeMedia(supabase, [data.video_path, ...data.fotos]);
  revalidarPublico("historia");
  return { ok: true };
}

export async function moverAno(id: string, direccion: -1 | 1): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: actual } = await supabase.from("history_years").select("id, orden").eq("id", id).single();
  if (!actual) return { ok: false, error: "No existe." };
  const { data: vecino } = await supabase
    .from("history_years")
    .select("id, orden")
    .filter("orden", direccion < 0 ? "lt" : "gt", actual.orden)
    .order("orden", { ascending: direccion > 0 })
    .limit(1)
    .maybeSingle();
  if (!vecino) return { ok: true };
  const a = await supabase.from("history_years").update({ orden: vecino.orden }).eq("id", actual.id);
  const b = await supabase.from("history_years").update({ orden: actual.orden }).eq("id", vecino.id);
  if (a.error || b.error) return { ok: false, error: errorMsg(a.error ?? b.error) };
  revalidarPublico("historia");
  return { ok: true };
}
