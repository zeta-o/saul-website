import type { Metadata } from "next";

import { BlogForm } from "@/components/admin/blog-form";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Nueva entrada" };

export default async function NuevoPostPage() {
  await requireAdmin();
  return (
    <>
      <AdminTitle eyebrow="Blog" title="Nueva entrada" />
      <BlogForm
        initial={{
          slug: "",
          titulo_es: "",
          titulo_en: "",
          resumen_es: "",
          resumen_en: "",
          cuerpo_es: "",
          cuerpo_en: "",
          portada_path: null,
          estado: "borrador",
        }}
      />
    </>
  );
}
