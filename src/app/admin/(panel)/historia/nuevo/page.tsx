import type { Metadata } from "next";

import { HistoryForm } from "@/components/admin/history-form";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Nuevo año" };

export default async function NuevoAnoPage() {
  await requireAdmin();
  return (
    <>
      <AdminTitle eyebrow="Mi historia" title="Nuevo año" />
      <HistoryForm
        initial={{
          label_es: "",
          label_en: "",
          titulo_es: "",
          titulo_en: "",
          cuerpo_es: "",
          cuerpo_en: "",
          cierre_es: "",
          cierre_en: "",
          logros_es: [],
          logros_en: [],
          video_path: null,
          fotos: [],
          inicial: false,
          publicado: true,
        }}
      />
    </>
  );
}
