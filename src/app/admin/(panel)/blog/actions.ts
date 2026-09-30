"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { errorMsg, removeMedia, slugify, texto, type ActionResult } from "@/lib/admin/common";
import type { PostEstado } from "@/lib/data/types";

export type PostInput = {
  id?: string;
  slug: string;
  titulo_es: string;
  titulo_en: string;
  resumen_es: string;
  resumen_en: string;
  cuerpo_es: string;
  cuerpo_en: string;
  portada_path: string | null;
  estado: PostEstado;
};

export async function guardarPost(input: PostInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();
  const titulo_es = texto(input.titulo_es, 200);
  if (!titulo_es) return { ok: false, error: "Escribe el título en español." };
  const slug = slugify(input.slug || titulo_es);
  if (!slug) return { ok: false, error: "La dirección (slug) no es válida." };
  const estado: PostEstado = input.estado === "publicado" ? "publicado" : "borrador";

  const row = {
    slug,
    titulo_es,
    titulo_en: texto(input.titulo_en, 200),
    resumen_es: texto(input.resumen_es, 600),
    resumen_en: texto(input.resumen_en, 600),
    cuerpo_es: texto(input.cuerpo_es, 50000),
    cuerpo_en: texto(input.cuerpo_en, 50000),
    portada_path: input.portada_path || null,
    estado,
  };

  if (input.id) {
    const { data: previo } = await supabase.from("blog_posts").select("portada_path, publicado_at").eq("id", input.id).single();
    const { error } = await supabase
      .from("blog_posts")
      .update({
        ...row,
        // La fecha de publicación se fija la primera vez que se publica.
        publicado_at: estado === "publicado" ? previo?.publicado_at ?? new Date().toISOString() : previo?.publicado_at ?? null,
      })
      .eq("id", input.id);
    if (error) return { ok: false, error: errorMsg(error) };
    if (previo?.portada_path && previo.portada_path !== row.portada_path) await removeMedia(supabase, [previo.portada_path]);
    return { ok: true, data: { id: input.id } };
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...row, publicado_at: estado === "publicado" ? new Date().toISOString() : null })
    .select("id")
    .single();
  if (error) return { ok: false, error: errorMsg(error) };
  return { ok: true, data: { id: data.id } };
}

export async function eliminarPost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("blog_posts").delete().eq("id", id).select("portada_path").single();
  if (error) return { ok: false, error: errorMsg(error, "No se pudo eliminar.") };
  await removeMedia(supabase, [data.portada_path]);
  return { ok: true };
}
