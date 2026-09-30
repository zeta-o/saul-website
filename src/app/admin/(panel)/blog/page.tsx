import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { EmptyState, AdminTitle, fechaHora } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import type { BlogPostRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });
  const posts = (data ?? []) as BlogPostRow[];

  return (
    <>
      <AdminTitle eyebrow="Contenido" title="Blog">
        <Button asChild size="sm">
          <Link href="/admin/blog/nuevo">
            <PlusIcon className="size-4" /> Nueva entrada
          </Link>
        </Button>
      </AdminTitle>
      <p className="mt-0 mb-6 max-w-[640px] text-base leading-[1.5] text-white/60">
        El blog todavía está oculto en el sitio: puedes ir escribiendo y publicando entradas, y se mostrarán cuando se active la página.
      </p>
      {posts.length === 0 ? (
        <EmptyState>Aún no hay entradas.</EmptyState>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/blog/${p.id}`}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-white/12 bg-white/[.04] px-4 py-3 transition-colors hover:bg-white/[.08]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-semibold">{p.titulo_es}</div>
                  <div className="text-sm text-white/45">
                    /{p.slug} · editado {fechaHora(p.updated_at)}
                  </div>
                </div>
                {!p.titulo_en && <Badge variant="red">Falta inglés</Badge>}
                <Badge variant={p.estado === "publicado" ? "green" : "neutral"}>{p.estado}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
