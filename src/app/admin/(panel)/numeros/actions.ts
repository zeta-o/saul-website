"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { errorMsg, texto, type ActionResult } from "@/lib/admin/common";
import type { MeasurementRow } from "@/lib/data/types";

export type MedicionInput = Omit<MeasurementRow, "id"> & { id?: string };

const NUMERICOS = [
  "peso_kg",
  "altura_m",
  "ftp_w",
  "vo2max",
  "p5s_w",
  "p1m_w",
  "p5m_w",
  "p20m_w",
  "horas_semana",
  "km_semana",
  "desnivel_semana_m",
  "carreras_temporada",
] as const;

export async function guardarMedicion(input: MedicionInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.fecha)) return { ok: false, error: "Elige la fecha de la medición." };

  const row: Record<string, unknown> = { fecha: input.fecha, notas: texto(input.notas, 1000) };
  for (const k of NUMERICOS) {
    const v = input[k];
    if (v === null || v === undefined || Number.isNaN(v)) row[k] = null;
    else if (typeof v !== "number" || v < 0) return { ok: false, error: `Valor inválido en ${k}.` };
    else row[k] = v;
  }
  if (NUMERICOS.every((k) => row[k] === null)) return { ok: false, error: "Ingresa al menos un número." };

  const { error } = input.id
    ? await supabase.from("measurements").update(row).eq("id", input.id)
    : await supabase.from("measurements").insert(row);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya hay una medición con esa fecha; edítala en la tabla." };
    return { ok: false, error: errorMsg(error) };
  }
  return { ok: true };
}

export async function eliminarMedicion(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("measurements").delete().eq("id", id);
  if (error) return { ok: false, error: errorMsg(error, "No se pudo eliminar.") };
  return { ok: true };
}
