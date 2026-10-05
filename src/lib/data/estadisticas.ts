import "server-only";

import type { MeasurementRow } from "@/lib/data/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Medición tal como la ven los entrenadores: sin las notas internas del admin. */
export type StatsRow = Omit<MeasurementRow, "notas">;

const COLUMNAS =
  "id, fecha, peso_kg, altura_m, ftp_w, vo2max, p5s_w, p1m_w, p5m_w, p20m_w, horas_semana, km_semana, desnivel_semana_m, carreras_temporada";

/**
 * Sesión de la página de estadísticas:
 * - null: nadie ha iniciado sesión.
 * - rows null: hay sesión, pero ese correo ya no tiene acceso.
 * - rows: mediciones en orden de fecha (RLS solo las entrega con acceso).
 */
export async function getAccesoStats(): Promise<{ email: string; rows: StatsRow[] | null } | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (!email) return null;

  const { data: tieneAcceso } = await supabase.rpc("is_allowed");
  if (!tieneAcceso) return { email, rows: null };

  const { data: rows, error } = await supabase.from("measurements").select(COLUMNAS).order("fecha");
  if (error) console.error("measurements (estadísticas):", error.message);
  return { email, rows: (rows ?? []) as StatsRow[] };
}
