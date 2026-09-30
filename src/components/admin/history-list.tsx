"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { eliminarAno, moverAno } from "@/app/admin/(panel)/historia/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HistoryYearRow } from "@/lib/data/types";

export function HistoryList({ years }: { years: Required<HistoryYearRow>[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  if (!years.length) return <EmptyState>Aún no hay años. Agrega el primero.</EmptyState>;

  const mover = (id: string, dir: -1 | 1) =>
    start(async () => {
      const res = await moverAno(id, dir);
      if (!res.ok) toast.error(res.error);
      router.refresh();
    });

  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {years.map((y, i) => (
        <li key={y.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-white/12 bg-white/[.04] px-4 py-3">
          <span className="w-24 flex-none text-[28px] leading-none font-extrabold italic">{y.label_es}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-semibold text-white/90">{y.titulo_es || "Sin título"}</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {y.inicial && <Badge variant="orange">Inicial</Badge>}
              {!y.publicado && <Badge>Oculto</Badge>}
              {!y.titulo_en && <Badge variant="red">Falta inglés</Badge>}
              <Badge variant="blue">{y.fotos.length} foto{y.fotos.length === 1 ? "" : "s"}{y.video_path ? " + video" : ""}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Subir" disabled={pending || i === 0} onClick={() => mover(y.id, -1)}>
              <ArrowUpIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Bajar" disabled={pending || i === years.length - 1} onClick={() => mover(y.id, 1)}>
              <ArrowDownIcon className="size-4" />
            </Button>
            <Button asChild variant="ghost" size="xs">
              <Link href={`/admin/historia/${y.id}`}>
                <PencilIcon className="size-3.5" /> Editar
              </Link>
            </Button>
            <ConfirmButton
              size="icon"
              ariaLabel="Eliminar"
              title={`Eliminar ${y.label_es}`}
              description="Se borrarán el texto, las fotos y el video de este año. No se puede deshacer."
              action={() => eliminarAno(y.id)}
              onDone={() => {
                toast.success("Año eliminado");
                router.refresh();
              }}
            >
              <Trash2Icon className="size-4" />
            </ConfirmButton>
          </div>
        </li>
      ))}
    </ol>
  );
}
