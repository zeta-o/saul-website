"use client";

import { Fragment } from "react";

import { PhotoSlot } from "@/components/site/photo-slot";
import { aboutCopy } from "@/content/sobre-mi";
import type { HistoryEntry } from "@/lib/data/historia";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAboutStore } from "@/stores/about-store";

const parrafoCls = "m-0 text-lg leading-[1.6] text-white/78";
const subCls = "mt-2.5 mb-0 text-[13px] leading-none font-semibold tracking-[.14em] text-brand-orange uppercase";

export function Timeline({
  lang,
  entries: list,
  initialId,
}: {
  lang: Locale;
  entries: HistoryEntry[];
  initialId?: string;
}) {
  const t = aboutCopy[lang];
  const year = useAboutStore((s) => s.year);
  const setYear = useAboutStore((s) => s.setYear);
  const active = list.find((y) => y.id === (year ?? initialId)) ?? list[0];
  if (!active) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-4 pb-24 md:px-8">
      <span className="mb-8 block text-[13px] leading-none font-semibold tracking-[.14em] text-brand-orange uppercase">{t.historico}</span>

      {/* En móvil la línea de tiempo hace scroll horizontal */}
      <div className="scrollbar-none -mx-4 mb-11 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
        <div className="relative md:min-w-0" style={{ minWidth: list.length * 104 }} role="tablist" aria-label={t.historico}>
          {/* Centrada en los puntos: alto del año + gap (10px) + mitad de la caja del punto (9px) - 1px */}
          <div className="absolute inset-x-0 top-[calc(clamp(22px,2.6vw,34px)+18px)] h-0.5 bg-brand-blue/45" />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
            {list.map((y) => {
              const selected = y.id === active.id;
              return (
                <button
                  key={y.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="timeline-panel"
                  onClick={() => setYear(y.id)}
                  className="group flex cursor-pointer flex-col items-center gap-2.5 bg-transparent outline-none"
                >
                  <span
                    className={cn(
                      "text-[clamp(22px,2.6vw,34px)] leading-none font-extrabold italic transition-colors duration-350",
                      selected ? "text-white" : "text-white/38 group-hover:text-white/70 group-focus-visible:text-white/70"
                    )}
                  >
                    {y.label}
                  </span>
                  <span className="flex h-[18px] items-center">
                    <span
                      className={cn(
                        "box-border rounded-full border-2 transition-all duration-350 ease-brand",
                        selected ? "size-[18px] border-brand-orange bg-brand-orange" : "size-3 border-white/38 bg-surface"
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <YearPanel key={`${lang}-${active.id}`} entry={active} placeholder={t.fotoAnio} />
    </section>
  );
}

function YearPanel({ entry, placeholder }: { entry: HistoryEntry; placeholder: string }) {
  return (
    <div
      id="timeline-panel"
      role="tabpanel"
      className="grid animate-year-in grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12"
    >
      <div>
        <h2 className="mt-0 mb-3.5 text-[28px] leading-[1.15] font-bold text-white">{entry.titulo}</h2>
        <div className="mb-6 flex flex-col gap-3.5">
          {entry.bloques.map((b, i) => (
            <Fragment key={i}>
              {b.subtitulo && <h3 className={subCls}>{b.subtitulo}</h3>}
              {b.parrafos.map((p, j) => <p key={j} className={parrafoCls}>{p}</p>)}
            </Fragment>
          ))}
          {entry.cierre && (
            <p className="mt-3.5 mb-0 text-[clamp(22px,3vw,30px)] leading-[1.2] font-semibold tracking-[.06em] text-white uppercase">{entry.cierre}</p>
          )}
        </div>
        {entry.logros.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {entry.logros.map((logro) => (
              <li key={logro} className="flex items-baseline gap-3">
                <span className="size-1.5 flex-none -translate-y-0.5 rounded-full bg-brand-blue" />
                <span className="text-[17px] leading-[1.4] font-medium text-white/85">{logro}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {entry.video ? (
          <video
            src={entry.video}
            loop
            muted
            playsInline
            preload="metadata"
            onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
            onClick={(e) => {
              // En táctil no hay hover: tocar alterna reproducción
              const v = e.currentTarget;
              if (v.paused) void v.play().catch(() => {});
              else v.pause();
            }}
            className="col-span-2 h-[320px] w-full cursor-pointer rounded-xl bg-[#111] object-contain md:h-[440px]"
          />
        ) : (
          <PhotoSlot src={entry.fotos[0]} alt={entry.titulo} placeholder={placeholder} className="col-span-2 h-[300px]" sizes="(max-width: 1024px) 100vw, 640px" />
        )}
        {/* Con video, las fotos 1 y 2 van abajo; sin video, la 0 es la grande. */}
        {(entry.video ? [0, 1] : [1, 2]).map((i) => (
          <PhotoSlot
            key={i}
            src={entry.fotos[i]}
            alt={entry.titulo}
            placeholder={placeholder}
            className="h-[140px] md:h-[180px]"
            sizes="(max-width: 1024px) 50vw, 320px"
          />
        ))}
      </div>
    </div>
  );
}
