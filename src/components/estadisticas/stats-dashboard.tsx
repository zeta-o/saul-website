"use client";

import { useMemo, useState } from "react";

import { cerrarSesionStats } from "@/app/[lang]/estadisticas/actions";
import { TimeChart, type Punto } from "@/components/admin/numeros/chart";
import { METRICS, nf, pesoVigente, type MetricKey } from "@/components/admin/numeros/metrics";
import { Panel, PanelTitle, fechaCorta } from "@/components/admin/ui";
import { PageTitle } from "@/components/site/inner-page";
import { UnderlineTabs } from "@/components/site/tabs";
import { statsCopy } from "@/content/estadisticas";
import type { StatsRow } from "@/lib/data/estadisticas";
import { nav, type Locale } from "@/lib/i18n";

type Unidad = "w" | "wkg";

const eyebrowCls = "block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase";
const metricLabelCls = "text-[10px] leading-none font-semibold tracking-[.16em] uppercase";

/** Decimales a mostrar según el paso del campo en el admin ("0.1" → 1). */
const decimales = (step: string) => step.split(".")[1]?.length ?? 0;

/** W/kg siempre con un decimal ("9,0"), como en el prototipo. */
const wkg = (v: number, lang: Locale) => (lang === "en" ? v.toFixed(1) : v.toFixed(1).replace(".", ","));

/** Estadísticas reales (tabla measurements) para quien tiene acceso. Solo lectura. */
export function StatsDashboard({ lang, email, rows }: { lang: Locale; email: string; rows: StatsRow[] }) {
  const t = statsCopy[lang];
  const [unidad, setUnidad] = useState<Unidad>("w");
  const pesos = useMemo(() => pesoVigente(rows), [rows]);
  const grupos = [
    { key: "Perfil", titulo: t.perfil },
    { key: "Potencia máxima", titulo: t.potencia },
    { key: "Carga de entrenamiento", titulo: t.carga },
  ] as const;

  /** Último valor registrado de una métrica, con su fecha y el peso vigente en esa fecha. */
  const ultimo = (key: MetricKey) => {
    for (let i = rows.length - 1; i >= 0; i--) {
      const v = rows[i][key];
      if (v !== null) return { v: Number(v), fecha: rows[i].fecha, peso: pesos[i] };
    }
    return null;
  };

  /** Serie de una métrica (solo fechas con valor), en W o W/kg según el selector. */
  const serie = (key: MetricKey): Punto[] => {
    const power = METRICS.find((m) => m.key === key)?.power;
    return rows.flatMap((r, i) => {
      const v = r[key];
      if (v === null) return [];
      const t = Date.parse(`${r.fecha}T00:00:00Z`);
      if (power && unidad === "wkg") return pesos[i] ? [{ t, v: Number(v) / pesos[i]! }] : [];
      return [{ t, v: Number(v) }];
    });
  };
  const powerUnit = unidad === "wkg" ? "W/kg" : "W";
  const powerDec = unidad === "wkg" ? 1 : 0;

  return (
    <section className="mx-auto max-w-[1200px] animate-year-in px-4 pt-12 pb-24 md:px-8">
      <span className={`${eyebrowCls} mb-3`}>{t.accesoOk}</span>
      <PageTitle className="mb-4">{nav[lang].stats}</PageTitle>
      <form action={cerrarSesionStats.bind(null, lang)} className="mb-9 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
        <span>
          {t.sesion} <span className="text-white/80">{email}</span>
        </span>
        <button type="submit" className="cursor-pointer text-white/55 underline underline-offset-4 hover:text-white">
          {t.salir}
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-white/75">{t.sinDatos}</p>
      ) : (
        <>
          {grupos.map((g) => (
            <div key={g.key} className="mb-10">
              <h2 className="mt-0 mb-[18px] text-[11px] leading-none font-semibold tracking-[.16em] text-white/50 uppercase">{g.titulo}</h2>
              <dl className="m-0 grid grid-cols-2 gap-6 md:grid-cols-4">
                {METRICS.filter((m) => m.grupo === g.key).map((m) => {
                  const u = ultimo(m.key);
                  const nota = !u
                    ? ""
                    : m.power && u.peso
                      ? `${wkg(u.v / u.peso, lang)} W/kg`
                      : `${t.alDia} ${fechaCorta(u.fecha, lang)}`;
                  return (
                    <div key={m.key} className="flex flex-col gap-1.5 border-t-2 border-brand-blue pt-3">
                      <dt className={`${metricLabelCls} text-white/50`}>{lang === "en" ? m.labelEn : m.label}</dt>
                      <dd className="m-0 text-[32px] leading-none font-bold text-white">
                        {u ? nf(u.v, decimales(m.step), lang) : "—"}
                        {u && m.unit && <span className="ml-1.5 text-base font-medium text-white/55">{m.unit}</span>}
                      </dd>
                      {nota && <dd className="m-0 text-sm leading-[1.3] font-medium text-white/55">{nota}</dd>}
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}

          <div className="mt-14 mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="m-0 text-[clamp(26px,3vw,34px)] leading-none font-extrabold tracking-[-.01em] uppercase italic">{t.evolucion}</h2>
            <UnderlineTabs<Unidad>
              items={[
                { value: "w", label: t.unidadW },
                { value: "wkg", label: t.unidadWkg },
              ]}
              value={unidad}
              onChange={setUnidad}
              label={t.unidad}
              className="gap-7 text-sm tracking-[.1em] [&>button]:pb-2"
            />
          </div>

          <div className="mb-10 flex flex-col gap-6">
            <Panel>
              <PanelTitle>
                {t.ftp} ({powerUnit})
              </PanelTitle>
              <TimeChart data={serie("ftp_w")} unit={powerUnit} decimals={powerDec} height={260} label={t.ftp} lang={lang} />
            </Panel>

            <Panel>
              <PanelTitle>
                {t.potencia} ({powerUnit})
              </PanelTitle>
              {/* Escalas muy distintas (5 s vs 20 min): una gráfica por duración, cada una con su eje. */}
              <div className="grid gap-6 sm:grid-cols-2">
                {(["p5s_w", "p1m_w", "p5m_w", "p20m_w"] as const).map((k) => {
                  const m = METRICS.find((x) => x.key === k)!;
                  const label = lang === "en" ? m.labelEn : m.label;
                  return (
                    <div key={k}>
                      <div className="mb-2 text-sm font-semibold text-white/75">{label}</div>
                      <TimeChart data={serie(k)} unit={powerUnit} decimals={powerDec} height={160} label={label} lang={lang} />
                    </div>
                  );
                })}
              </div>
            </Panel>

            <div className="grid gap-6 md:grid-cols-2">
              <Panel>
                <PanelTitle>{t.peso}</PanelTitle>
                <TimeChart data={serie("peso_kg")} unit="kg" decimals={1} height={200} label={t.peso} lang={lang} />
              </Panel>
              <Panel>
                <PanelTitle>{t.volumen}</PanelTitle>
                <TimeChart data={serie("horas_semana")} unit="h" decimals={1} height={200} label={t.volumen} lang={lang} />
              </Panel>
            </div>
          </div>

          <p className="m-0 max-w-[560px] text-[15px] leading-[1.5] text-white/50">{t.disclaimer}</p>
        </>
      )}
    </section>
  );
}
