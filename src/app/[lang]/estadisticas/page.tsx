import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatsGate } from "@/components/estadisticas/stats-gate";
import { InnerPage } from "@/components/site/inner-page";
import { hasLocale, nav } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/estadisticas">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? nav[lang].stats : undefined, robots: { index: false } };
}

export default async function EstadisticasPage({ params }: PageProps<"/[lang]/estadisticas">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <InnerPage lang={lang}>
      <StatsGate lang={lang} />
    </InnerPage>
  );
}
