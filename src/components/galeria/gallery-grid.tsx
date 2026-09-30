"use client";

import { PhotoSlot } from "@/components/site/photo-slot";
import { UnderlineTabs } from "@/components/site/tabs";
import { GALLERY, galleryCopy, type Disciplina, type GalleryItem } from "@/content/galeria";
import type { Locale } from "@/lib/i18n";
import { useGalleryStore, type GalleryTab } from "@/stores/gallery-store";

const BLOCKS: Disciplina[] = ["ruta", "montana"];

export function GalleryGrid({ lang }: { lang: Locale }) {
  const t = galleryCopy[lang];
  const tab = useGalleryStore((s) => s.tab);
  const setTab = useGalleryStore((s) => s.setTab);

  const tabs: { value: GalleryTab; label: string }[] = [
    { value: "todas", label: t.todas },
    { value: "ruta", label: t.ruta },
    { value: "montana", label: t.montana },
  ];

  return (
    <>
      <UnderlineTabs
        items={tabs}
        value={tab}
        onChange={setTab}
        label={nav(lang)}
        className="mb-8 gap-7 text-sm tracking-[.1em] [&>button]:pb-2"
      />
      {BLOCKS.filter((d) => tab === "todas" || tab === d).map((d) => (
        <div key={d} className="mb-7 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-5 gap-y-7 last:mb-0">
          {GALLERY.filter((item) => item.disciplina === d).map((item) => (
            <Figure key={item.id} item={item} lang={lang} />
          ))}
        </div>
      ))}
    </>
  );
}

function nav(lang: Locale) {
  return lang === "es" ? "Filtrar por disciplina" : "Filter by discipline";
}

function Figure({ item, lang }: { item: GalleryItem; lang: Locale }) {
  const t = galleryCopy[lang];
  const descripcion = lang === "es" ? item.descripcion_es : item.descripcion_en;
  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <PhotoSlot
        src={item.src}
        alt={descripcion}
        placeholder={item.disciplina === "ruta" ? t.placeholderRuta : t.placeholderMontana}
        className="h-[260px]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
      />
      <figcaption className="flex flex-col gap-1">
        <span className="text-[17px] leading-[1.35] text-white/85">{descripcion}</span>
        {item.fotografo_url ? (
          <a
            href={item.fotografo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm leading-[1.3] text-white/50 transition-colors hover:text-brand-orange"
          >
            {t.foto}: {item.fotografo_handle}
          </a>
        ) : (
          <span className="text-sm leading-[1.3] text-white/50">
            {t.foto}: {item.fotografo_handle}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
