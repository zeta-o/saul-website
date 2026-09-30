import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { HistoryList } from "@/components/admin/history-list";
import { AdminTitle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import type { HistoryYearRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Mi historia" };

export default async function AdminHistoriaPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("history_years").select("*").order("orden");
  return (
    <>
      <AdminTitle eyebrow="Sobre mí" title="Mi historia">
        <Button asChild size="sm">
          <Link href="/admin/historia/nuevo">
            <PlusIcon className="size-4" /> Agregar año
          </Link>
        </Button>
      </AdminTitle>
      <p className="mt-0 mb-6 max-w-[640px] text-base leading-[1.5] text-white/60">
        Los años aparecen en la línea de tiempo en este orden. El marcado como <strong className="text-white/85">inicial</strong> es el
        que se ve seleccionado al abrir la página.
      </p>
      <HistoryList years={(data ?? []) as Required<HistoryYearRow>[]} />
    </>
  );
}
