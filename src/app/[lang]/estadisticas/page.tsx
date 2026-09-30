import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatsDashboard } from "@/components/estadisticas/stats-dashboard";
import { StatsGate } from "@/components/estadisticas/stats-gate";
import { InnerPage } from "@/components/site/inner-page";
import { getAccesoStats } from "@/lib/data/estadisticas";
import { hasLocale, nav } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/estadisticas">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? nav[lang].stats : undefined, robots: { index: false } };
}

export default async function EstadisticasPage({ params, searchParams }: PageProps<"/[lang]/estadisticas">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { error } = await searchParams;

  // Página dinámica: depende de la sesión (cookies) de quien la visita.
  const acceso = await getAccesoStats();

  return (
    <InnerPage lang={lang}>
      {acceso?.rows ? (
        <StatsDashboard lang={lang} email={acceso.email} rows={acceso.rows} />
      ) : (
        <StatsGate
          lang={lang}
          aviso={acceso || error === "sinAcceso" ? "sinAcceso" : error === "enlace" ? "enlace" : undefined}
        />
      )}
    </InnerPage>
  );
}
