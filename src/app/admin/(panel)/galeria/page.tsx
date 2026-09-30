import type { Metadata } from "next";

import { GalleryAdmin } from "@/components/admin/gallery-admin";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { GalleryRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Galería" };

export default async function AdminGaleriaPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_items").select("*").order("orden").order("created_at");
  return (
    <>
      <AdminTitle eyebrow="Contenido" title="Galería" />
      <GalleryAdmin items={(data ?? []) as GalleryRow[]} />
    </>
  );
}
