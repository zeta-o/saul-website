import "server-only";

import { updateTag } from "next/cache";

import type { requireAdmin } from "@/lib/admin/auth";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import type { ContentTag } from "@/lib/supabase/public";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

/** Borra del bucket los archivos subidos (ignora rutas del sitio como /images/…). */
export async function removeMedia(supabase: Supabase, paths: (string | null | undefined)[]) {
  const objetos = paths.filter((p): p is string => Boolean(p) && !p!.startsWith("/"));
  if (!objetos.length) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(objetos);
  if (error) console.error("storage remove:", error.message);
}

/** Actualiza el contenido público (ES y EN) que depende de estas tablas. Solo en server actions. */
export function revalidarPublico(...tags: ContentTag[]) {
  for (const t of tags) updateTag(t);
}

export const errorMsg = (e: { message: string; code?: string } | null, fallback = "No se pudo guardar.") =>
  e ? (e.code === "23505" ? "Ya existe un registro con ese valor." : `${fallback} (${e.message})`) : fallback;

export const texto = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "Campeonato Nacional 2026" → "campeonato-nacional-2026" */
export const slugify = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
