import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryGrid } from "@/components/galeria/gallery-grid";
import { InnerPage, PageTitle } from "@/components/site/inner-page";
import { getGallery } from "@/lib/data/public";
import { hasLocale, nav } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/galeria">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? nav[lang].galeria : undefined };
}

export default async function GaleriaPage({ params }: PageProps<"/[lang]/galeria">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <InnerPage lang={lang}>
      <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 md:px-8 md:pt-12">
        <PageTitle className="mb-7">{nav[lang].galeria}</PageTitle>
        <GalleryGrid lang={lang} items={await getGallery()} />
      </section>
    </InnerPage>
  );
}
