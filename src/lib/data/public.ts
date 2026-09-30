import "server-only";

import { cache } from "react";

import { GALLERY } from "@/content/galeria";
import { HISTORY_ROWS } from "@/content/historia";
import { toHistoryEntry, type HistoryEntry } from "@/lib/data/historia";
import type { GalleryRow, HistoryYearRow } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

// Lecturas de las páginas públicas. Sin Supabase configurado (o si la consulta
// falla) se usa el contenido estático de src/content, así el sitio nunca queda vacío.

const getHistoryRows = cache(async (): Promise<HistoryYearRow[]> => {
  if (!isSupabaseConfigured) return HISTORY_ROWS;
  const { data, error } = await createPublicClient("historia")
    .from("history_years")
    .select("*")
    .eq("publicado", true)
    .order("orden");
  if (error) {
    console.error("history_years:", error.message);
    return HISTORY_ROWS;
  }
  return data;
});

export async function getHistory(lang: Locale): Promise<{ entries: HistoryEntry[]; initialId?: string }> {
  const rows = await getHistoryRows();
  const entries = rows.map((r) => toHistoryEntry(r, lang));
  const initial = rows.findIndex((r) => r.inicial);
  return { entries, initialId: entries[initial >= 0 ? initial : 0]?.id };
}

export const getGallery = cache(async (): Promise<GalleryRow[]> => {
  if (!isSupabaseConfigured) return GALLERY;
  const { data, error } = await createPublicClient("galeria")
    .from("gallery_items")
    .select("*")
    .eq("publicado", true)
    .order("orden")
    .order("created_at");
  if (error) {
    console.error("gallery_items:", error.message);
    return GALLERY;
  }
  return data;
});
