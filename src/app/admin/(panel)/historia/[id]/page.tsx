import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HistoryForm } from "@/components/admin/history-form";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { HistoryYearRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Editar año" };

export default async function EditarAnoPage({ params }: PageProps<"/admin/historia/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("history_years").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as HistoryYearRow & { id: string };
  return (
    <>
      <AdminTitle eyebrow="Mi historia" title={`Editar ${row.label_es}`} />
      <HistoryForm initial={row} />
    </>
  );
}
