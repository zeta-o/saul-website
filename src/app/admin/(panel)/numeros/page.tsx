import type { Metadata } from "next";

import { NumerosDashboard } from "@/components/admin/numeros/dashboard";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { MeasurementRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Números" };

export default async function AdminNumerosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("measurements").select("*").order("fecha");
  return (
    <>
      <AdminTitle eyebrow="Privado" title="Números" />
      <NumerosDashboard rows={(data ?? []) as MeasurementRow[]} />
    </>
  );
}
