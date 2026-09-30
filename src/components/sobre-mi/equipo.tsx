"use client";

import { XIcon } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PhotoSlot } from "@/components/site/photo-slot";
import { aboutCopy, EQUIPO } from "@/content/sobre-mi";
import type { Locale } from "@/lib/i18n";
import { useAboutStore } from "@/stores/about-store";

const labelCls = "text-[10px] leading-none font-semibold tracking-[.16em] uppercase";

export function EquipoSection({ lang }: { lang: Locale }) {
  const t = aboutCopy[lang];
  const { bikes, gear } = EQUIPO[lang];
  const modalOpen = useAboutStore((s) => s.modalOpen);
  const setModalOpen = useAboutStore((s) => s.setModalOpen);

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-6 pb-14 md:px-8">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="grid w-full cursor-pointer grid-cols-1 items-center gap-6 rounded-2xl border border-l-4 border-white/12 border-l-brand-blue bg-white/5 px-6 py-7 text-left transition-colors outline-none hover:bg-white/9 focus-visible:ring-2 focus-visible:ring-ring/60 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-10 md:px-9 md:py-8"
          >
            <div>
              <span className="mb-2.5 block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">{t.equipoTitulo}</span>
              <h2 className="m-0 text-[clamp(26px,3vw,38px)] leading-none font-extrabold tracking-[-.01em] text-white uppercase italic">{t.equipoHeadline}</h2>
            </div>
            <div className="flex flex-col gap-3.5">
              {bikes.map((bike) => (
                <div key={bike.id} className="flex flex-col gap-[3px]">
                  <span className={`${labelCls} text-brand-blue-light`}>{bike.disciplina}</span>
                  <span className="text-xl leading-[1.1] font-semibold text-white">{bike.nombre}</span>
                </div>
              ))}
            </div>
            <span className="justify-self-start rounded-lg bg-brand-blue px-[26px] py-[14px] text-[13px] leading-none font-semibold tracking-[.1em] text-white uppercase md:justify-self-auto">
              {t.verMas}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-[980px] overflow-hidden rounded-[20px] border border-white/10 bg-panel animate-modal-in">
          <div className="flex items-end justify-between gap-6 border-b border-white/10 px-6 pt-8 pb-6 md:px-10">
            <div>
              <span className="mb-2.5 block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">{t.equipoTitulo}</span>
              <DialogTitle className="m-0 text-[34px] leading-none font-extrabold tracking-[-.01em] text-white uppercase italic">{t.equipoHeadline}</DialogTitle>
              <DialogDescription className="sr-only">{bikes.map((b) => b.nombre).join(" · ")}</DialogDescription>
            </div>
            <DialogClose
              className="flex size-[34px] flex-none cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={t.cerrar}
            >
              <XIcon className="size-4" />
            </DialogClose>
          </div>

          {bikes.map((bike) => (
            <div key={bike.id} className="grid grid-cols-1 items-start gap-6 border-b border-white/8 px-6 py-8 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-9 md:px-10">
              <div>
                <PhotoSlot src={bike.foto} alt={bike.nombre} placeholder={t.fotoBici} className="h-[200px]" sizes="340px" />
                <span className="mt-3.5 block text-[11px] leading-none font-semibold tracking-[.16em] text-brand-blue-light uppercase">{bike.disciplina}</span>
                <h3 className="mt-2 mb-0 text-[26px] leading-[1.05] font-bold text-white">{bike.nombre}</h3>
              </div>
              <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-0.5 sm:grid-cols-2">
                {bike.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1 border-b border-white/9 py-3">
                    <dt className={`${labelCls} text-white/45`}>{spec.label}</dt>
                    <dd className="m-0 text-[17px] leading-[1.25] font-medium text-white">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="px-6 pt-7 pb-[34px] md:px-10">
            <span className="mb-[18px] block text-[11px] leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">{t.materialTitulo}</span>
            <dl className="m-0 grid grid-cols-2 gap-7 md:grid-cols-4">
              {gear.map((g) => (
                <div key={g.label} className="flex flex-col gap-[5px] border-t-2 border-brand-blue pt-3">
                  <dt className={`${labelCls} text-white/45`}>{g.label}</dt>
                  <dd className="m-0 text-base leading-[1.3] font-medium text-white">{g.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
