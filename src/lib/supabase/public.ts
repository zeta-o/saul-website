import "server-only";

import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/** Etiquetas de caché del contenido público; el admin las invalida al guardar. */
export type ContentTag = "galeria" | "historia";

/**
 * Cliente anónimo sin cookies para las páginas públicas. Las lecturas quedan en la
 * caché de datos de Next con una etiqueta, así las páginas siguen siendo estáticas y
 * el admin las actualiza con updateTag() en cuanto se guarda un cambio.
 */
export function createPublicClient(tag?: ContentTag) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: tag
      ? { fetch: (input, init) => fetch(input, { ...init, cache: "force-cache", next: { tags: [tag] } }) }
      : undefined,
  });
}
