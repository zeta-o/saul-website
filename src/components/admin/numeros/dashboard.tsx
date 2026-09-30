"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { eliminarMedicion } from "@/app/admin/(panel)/numeros/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TimeChart, type Punto } from "@/components/admin/numeros/chart";
import { MedicionDialog } from "@/components/admin/numeros/medicion-dialog";
import { METRICS, nf, pesoVigente, type MetricKey } from "@/components/admin/numeros/metrics";
import { EmptyState, Panel, PanelTitle, fechaCorta } from "@/components/admin/ui";
import { UnderlineTabs } from "@/components/site/tabs";
import { Button } from "@/components/ui/button";
import type { MeasurementRow } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Unidad = "w" | "wkg";

export function NumerosDashboard({ rows }: { rows: MeasurementRow[] }) {
  const router = useRouter();
  const [unidad, setUnidad] = useState<Unidad>("w");
  const [editing, setEditing] = useState<Partial<MeasurementRow> | null>(null);
  const pesos = useMemo(() => pesoVigente(rows), [rows]);

  /** Serie de una métrica (solo fechas con valor), en W o W/kg según el selector. */
  const serie = (key: MetricKey): Punto[] => {
    const power = METRICS.find((m) => m.key === key)?.power;
    return rows.flatMap((r, i) => {
      const v = r[key];
      if (v === null) return [];
      if (power && unidad === "wkg") {
        const peso = pesos[i];
        return peso ? [{ t: Date.parse(`${r.fecha}T00:00:00Z`), v: Number(v) / peso }] : [];
      }
      return [{ t: Date.parse(`${r.fecha}T00:00:00Z`), v: Number(v) }];
    });
  };
  const powerUnit = unidad === "wkg" ? "W/kg" : "W";
  const powerDec = unidad === "wkg" ? 1 : 0;

  const nueva = () => setEditing({ fecha: new Date().toISOString().slice(0, 10) });

  if (!rows.length)
    return (
      <>
        <EmptyState>
          Aún no hay mediciones. Registra la primera y aquí verás la evolución.
          <div className="mt-5">
            <Button size="sm" onClick={nueva}>
              <PlusIcon className="size-4" /> Nueva medición
            </Button>
          </div>
        </EmptyState>
        {editing && (
          <MedicionDialog
            value={editing}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros en una fila, arriba de las gráficas */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <UnderlineTabs<Unidad>
          items={[
            { value: "w", label: "Vatios (W)" },
            { value: "wkg", label: "Relativo (W/kg)" },
          ]}
          value={unidad}
          onChange={setUnidad}
          label="Unidad de potencia"
          className="gap-7 text-sm tracking-[.1em] [&>button]:pb-2"
        />
        <Button size="sm" onClick={nueva}>
          <PlusIcon className="size-4" /> Nueva medición
        </Button>
      </div>

      <StatTiles rows={rows} pesos={pesos} unidad={unidad} />

      <Panel>
        <PanelTitle>FTP ({powerUnit})</PanelTitle>
        <TimeChart data={serie("ftp_w")} unit={powerUnit} decimals={powerDec} height={260} label="FTP" />
      </Panel>

      <Panel>
        <PanelTitle>Potencia máxima ({powerUnit})</PanelTitle>
        {/* Escalas muy distintas (5 s vs 20 min): una gráfica por duración, cada una con su eje. */}
        <div className="grid gap-6 sm:grid-cols-2">
          {(["p5s_w", "p1m_w", "p5m_w", "p20m_w"] as const).map((k) => {
            const m = METRICS.find((x) => x.key === k)!;
            return (
              <div key={k}>
                <div className="mb-2 text-sm font-semibold text-white/75">{m.label}</div>
                <TimeChart data={serie(k)} unit={powerUnit} decimals={powerDec} height={160} label={m.label} />
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel>
          <PanelTitle>Peso (kg)</PanelTitle>
          <TimeChart data={serie("peso_kg")} unit="kg" decimals={1} height={200} label="Peso" />
        </Panel>
        <Panel>
          <PanelTitle>Volumen semanal (h)</PanelTitle>
          <TimeChart data={serie("horas_semana")} unit="h" decimals={1} height={200} label="Volumen semanal" />
        </Panel>
      </div>

      <Panel className="overflow-hidden p-0 md:p-0">
        <PanelTitle className="px-5 pt-5 md:px-6">Historial</PanelTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-[15px] tabular-nums">
            <thead>
              <tr className="border-b border-white/10 text-[11px] tracking-[.12em] text-white/50 uppercase">
                <th className="px-5 py-3 font-semibold md:px-6">Fecha</th>
                <th className="px-3 py-3 text-right font-semibold">Peso</th>
                <th className="px-3 py-3 text-right font-semibold">FTP</th>
                <th className="px-3 py-3 text-right font-semibold">W/kg</th>
                <th className="px-3 py-3 text-right font-semibold">5 s</th>
                <th className="px-3 py-3 text-right font-semibold">1 min</th>
                <th className="px-3 py-3 text-right font-semibold">5 min</th>
                <th className="px-3 py-3 text-right font-semibold">20 min</th>
                <th className="px-3 py-3 text-right font-semibold">h/sem</th>
                <th className="px-3 py-3 font-semibold">Notas</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {[...rows].reverse().map((r) => {
                const i = rows.indexOf(r);
                const wkg = r.ftp_w && pesos[i] ? nf(r.ftp_w / pesos[i]!, 1) : "—";
                const c = (v: number | null, d = 0) => (v === null ? "—" : nf(Number(v), d));
                return (
                  <tr key={r.id} className="border-b border-white/[.06] last:border-0 hover:bg-white/[.03]">
                    <td className="px-5 py-2.5 whitespace-nowrap md:px-6">{fechaCorta(r.fecha)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.peso_kg, 1)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.ftp_w)}</td>
                    <td className="px-3 py-2.5 text-right">{wkg}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.p5s_w)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.p1m_w)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.p5m_w)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.p20m_w)}</td>
                    <td className="px-3 py-2.5 text-right">{c(r.horas_semana, 1)}</td>
                    <td className="max-w-[220px] truncate px-3 py-2.5 text-white/55" title={r.notas}>
                      {r.notas}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <Button variant="ghost" size="icon" aria-label={`Editar ${r.fecha}`} onClick={() => setEditing(r)}>
                        <PencilIcon className="size-4" />
                      </Button>
                      <ConfirmButton
                        size="icon"
                        ariaLabel={`Eliminar ${r.fecha}`}
                        title="Eliminar medición"
                        description={`Se borrará la medición del ${fechaCorta(r.fecha)}.`}
                        action={() => eliminarMedicion(r.id)}
                        onDone={() => {
                          toast.success("Medición eliminada");
                          router.refresh();
                        }}
                      >
                        <Trash2Icon className="size-4" />
                      </ConfirmButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {editing && (
        <MedicionDialog
          value={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

/** Últimos valores con el cambio respecto a la medición anterior que tenga ese dato. */
function StatTiles({ rows, pesos, unidad }: { rows: MeasurementRow[]; pesos: (number | null)[]; unidad: Unidad }) {
  const ultimoDe = (key: MetricKey, wkg = false) => {
    const vals = rows
      .map((r, i) => {
        const v = r[key];
        if (v === null) return null;
        if (!wkg) return { v: Number(v), fecha: r.fecha };
        return pesos[i] ? { v: Number(v) / pesos[i]!, fecha: r.fecha } : null;
      })
      .filter((x): x is { v: number; fecha: string } => x !== null);
    return { actual: vals.at(-1), previo: vals.at(-2) };
  };

  const tiles = [
    { key: "ftp_w" as const, label: unidad === "wkg" ? "FTP relativo" : "FTP", wkg: unidad === "wkg", unit: unidad === "wkg" ? "W/kg" : "W", dec: unidad === "wkg" ? 2 : 0, hero: true },
    { key: "p20m_w" as const, label: "20 minutos", wkg: unidad === "wkg", unit: unidad === "wkg" ? "W/kg" : "W", dec: unidad === "wkg" ? 1 : 0 },
    { key: "peso_kg" as const, label: "Peso", wkg: false, unit: "kg", dec: 1 },
    { key: "vo2max" as const, label: "VO₂ máx", wkg: false, unit: "", dec: 1 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((t) => {
        const { actual, previo } = ultimoDe(t.key, t.wkg);
        const meta = METRICS.find((m) => m.key === t.key)!;
        const delta = actual && previo ? actual.v - previo.v : null;
        const bueno = delta === null || meta.upIsGood === null || delta === 0 ? null : (delta > 0) === meta.upIsGood;
        return (
          <Panel key={t.key} className="flex flex-col gap-2 border-t-2 border-t-brand-blue">
            <span className="text-[11px] leading-none font-semibold tracking-[.14em] text-white/55 uppercase">{t.label}</span>
            <span className={cn("leading-none font-bold text-white", t.hero ? "text-[48px]" : "text-[32px]")}>
              {actual ? nf(actual.v, t.dec) : "—"}
              {actual && t.unit && <span className="ml-1.5 text-base font-medium text-white/55">{t.unit}</span>}
            </span>
            <span className="text-[13px] leading-[1.35] text-white/45">
              {delta !== null && (
                <span className={cn("font-semibold", bueno === true && "text-emerald-300", bueno === false && "text-red-300", bueno === null && "text-white/70")}>
                  {delta > 0 ? "+" : delta < 0 ? "−" : "±"}
                  {nf(Math.abs(delta), t.dec)}{" "}
                </span>
              )}
              {actual ? (previo ? `vs. ${fechaCorta(previo.fecha)}` : `al ${fechaCorta(actual.fecha)}`) : "sin datos"}
            </span>
          </Panel>
        );
      })}
    </div>
  );
}
