"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { nf } from "@/components/admin/numeros/metrics";
import { fechaCorta, mesCorto } from "@/components/admin/ui";
import type { Locale } from "@/lib/i18n";

// Azul de la marca ajustado para fondo oscuro (validado: luminosidad y contraste vs #2a2a2a).
export const SERIES = "#4d8df5";
const GRID = "rgba(255,255,255,.08)";
const AXIS = "rgba(255,255,255,.45)";
const SURFACE = "#262626";

export type Punto = { t: number; v: number };

const fechaLarga = (t: number, lang: Locale) => fechaCorta(new Date(t).toISOString(), lang);

/** Una serie en el tiempo: línea de 2px, lavado al 10%, cruz y tooltip al pasar. */
export function TimeChart({
  data,
  unit,
  decimals = 0,
  height = 220,
  label,
  lang = "es",
}: {
  data: Punto[];
  unit: string;
  decimals?: number;
  height?: number;
  label: string;
  lang?: Locale;
}) {
  if (data.length === 0)
    return (
      <div className="flex items-center justify-center text-sm text-white/40" style={{ height }}>
        {lang === "en" ? "No data yet" : "Sin datos todavía"}
      </div>
    );
  const pocos = data.length <= 16;
  const fmt = (v: number) => `${nf(v, decimals, lang)}${unit ? ` ${unit}` : ""}`;

  return (
    <div role="img" aria-label={`${label}: ${data.map((d) => `${fechaLarga(d.t, lang)} ${fmt(d.v)}`).join("; ")}`}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={data.length === 1 ? [data[0].t - 864e5 * 15, data[0].t + 864e5 * 15] : ["dataMin", "dataMax"]}
            tickFormatter={(t: number) => mesCorto(t, lang)}
            tick={{ fill: AXIS, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            minTickGap={24}
          />
          <YAxis
            width={48}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => nf(v, decimals, lang)}
            tick={{ fill: AXIS, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={decimals > 0}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,.35)", strokeWidth: 1 }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as Punto | undefined;
              if (!active || !p) return null;
              return (
                <div className="rounded-lg border border-white/15 bg-[#1b1b1b] px-3 py-2 shadow-none">
                  <div className="text-xs text-white/55">{fechaLarga(p.t, lang)}</div>
                  <div className="flex items-center gap-2 text-base font-semibold text-white">
                    <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: SERIES }} />
                    {fmt(p.v)}
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={SERIES}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill={SERIES}
            fillOpacity={0.1}
            dot={pocos ? { r: 4, fill: SERIES, stroke: SURFACE, strokeWidth: 2 } : false}
            activeDot={{ r: 5, fill: SERIES, stroke: SURFACE, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
