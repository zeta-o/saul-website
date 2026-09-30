import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { BlogPostRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Editar entrada" };

export default async function EditarPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as BlogPostRow;
  return (
    <>
      <AdminTitle eyebrow="Blog" title="Editar entrada" />
      <BlogForm initial={post} publicadoAt={post.publicado_at} />
    </>
  );
}
