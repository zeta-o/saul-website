"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ExternalLinkIcon, RotateCcwIcon, UserPlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import {
  agregarAcceso,
  aprobarSolicitud,
  reabrirSolicitud,
  rechazarSolicitud,
  revocarAcceso,
} from "@/app/admin/(panel)/accesos/actions";
import { AdminDialog } from "@/components/admin/admin-dialog";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EmptyState, Field, fechaHora } from "@/components/admin/ui";
import { UnderlineTabs } from "@/components/site/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/admin/common";
import type { AccessRequestRow, AllowedEmailRow, SolicitudEstado } from "@/lib/data/types";

type Tab = SolicitudEstado | "acceso";

export function AccessAdmin({ solicitudes, permitidos }: { solicitudes: AccessRequestRow[]; permitidos: AllowedEmailRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pendiente");
  const [pending, start] = useTransition();
  const [agregando, setAgregando] = useState(false);
  const cuenta = (e: SolicitudEstado) => solicitudes.filter((s) => s.estado === e).length;

  const run = (fn: () => Promise<ActionResult>, ok: string) =>
    start(async () => {
      const res = await fn();
      if (!res.ok) return void toast.error(res.error);
      toast.success(ok);
      router.refresh();
    });

  const lista = solicitudes.filter((s) => s.estado === tab);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <UnderlineTabs<Tab>
          items={[
            { value: "pendiente", label: `Pendientes (${cuenta("pendiente")})` },
            { value: "aprobada", label: `Aprobadas (${cuenta("aprobada")})` },
            { value: "rechazada", label: `Rechazadas (${cuenta("rechazada")})` },
            { value: "acceso", label: `Con acceso (${permitidos.length})` },
          ]}
          value={tab}
          onChange={setTab}
          label="Estado"
          className="flex-wrap gap-x-7 gap-y-3 text-sm tracking-[.1em] [&>button]:pb-2"
        />
        <Button size="sm" variant="outline" onClick={() => setAgregando(true)}>
          <UserPlusIcon className="size-4" /> Dar acceso
        </Button>
      </div>

      {tab === "acceso" ? (
        permitidos.length === 0 ? (
          <EmptyState>Nadie tiene acceso todavía.</EmptyState>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {permitidos.map((p) => (
              <li key={p.email} className="flex flex-wrap items-center gap-4 rounded-xl border border-white/12 bg-white/[.04] px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold">{p.nombre || p.email}</div>
                  <div className="text-sm text-white/50">
                    {p.nombre && <>{p.email} · </>}desde {fechaHora(p.created_at)}
                  </div>
                </div>
                {p.acepta_actualizaciones && <Badge variant="blue">Recibe actualizaciones</Badge>}
                <ConfirmButton
                  variant="outline"
                  title="Revocar acceso"
                  description={`${p.email} dejará de poder ver los números.`}
                  confirmLabel="Revocar"
                  action={() => revocarAcceso(p.email)}
                  onDone={() => {
                    toast.success("Acceso revocado");
                    router.refresh();
                  }}
                >
                  Revocar
                </ConfirmButton>
              </li>
            ))}
          </ul>
        )
      ) : lista.length === 0 ? (
        <EmptyState>{tab === "pendiente" ? "No hay solicitudes pendientes." : "No hay solicitudes en esta lista."}</EmptyState>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {lista.map((s) => (
            <li key={s.id} className="rounded-xl border border-white/12 bg-white/[.04] px-4 py-4 md:px-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold">{s.nombre}</div>
                  <a href={`mailto:${s.correo}`} className="text-[15px] text-white/70 hover:text-brand-orange">
                    {s.correo}
                  </a>
                  <dl className="m-0 mt-2 grid gap-x-6 gap-y-1 text-sm text-white/55 sm:grid-cols-[auto_1fr]">
                    {s.rol && (
                      <>
                        <dt className="font-semibold text-white/40">Equipo o rol</dt>
                        <dd className="m-0 text-white/80">{s.rol}</dd>
                      </>
                    )}
                    {s.social_url && (
                      <>
                        <dt className="font-semibold text-white/40">Red social</dt>
                        <dd className="m-0 min-w-0">
                          <a href={s.social_url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 text-white/80 hover:text-brand-orange">
                            <span className="truncate">{s.social_url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            <ExternalLinkIcon className="size-3.5 flex-none" />
                          </a>
                        </dd>
                      </>
                    )}
                    <dt className="font-semibold text-white/40">Recibida</dt>
                    <dd className="m-0">{fechaHora(s.created_at)}</dd>
                    {s.decidido_at && (
                      <>
                        <dt className="font-semibold text-white/40">{s.estado === "aprobada" ? "Aprobada" : "Rechazada"}</dt>
                        <dd className="m-0">{fechaHora(s.decidido_at)}</dd>
                      </>
                    )}
                  </dl>
                </div>
                {s.acepta_actualizaciones && <Badge variant="blue">Quiere actualizaciones</Badge>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.estado !== "aprobada" && (
                  <Button size="xs" disabled={pending} onClick={() => run(() => aprobarSolicitud(s.id), `Acceso aprobado para ${s.correo}`)}>
                    <CheckIcon className="size-4" /> Aprobar
                  </Button>
                )}
                {s.estado === "pendiente" && (
                  <Button size="xs" variant="outline" disabled={pending} onClick={() => run(() => rechazarSolicitud(s.id), "Solicitud rechazada")}>
                    <XIcon className="size-4" /> Rechazar
                  </Button>
                )}
                {s.estado === "rechazada" && (
                  <Button size="xs" variant="ghost" disabled={pending} onClick={() => run(() => reabrirSolicitud(s.id), "Solicitud reabierta")}>
                    <RotateCcwIcon className="size-4" /> Volver a pendiente
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {agregando && (
        <AgregarDialog
          onClose={() => setAgregando(false)}
          onSaved={() => {
            setAgregando(false);
            setTab("acceso");
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function AgregarDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [pending, start] = useTransition();
  return (
    <AdminDialog open onOpenChange={(o) => !o && onClose()} title="Dar acceso" description="Para alguien que no llenó el formulario.">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await agregarAcceso(email, nombre);
            if (!res.ok) return void toast.error(res.error);
            toast.success("Acceso agregado");
            onSaved();
          });
        }}
      >
        <Field label="Correo *" htmlFor="acc-email">
          <Input id="acc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Nombre" htmlFor="acc-nombre">
          <Input id="acc-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button type="button" variant="outline" size="xs" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="xs" disabled={pending}>
            {pending ? "Guardando…" : "Dar acceso"}
          </Button>
        </div>
      </form>
    </AdminDialog>
  );
}
