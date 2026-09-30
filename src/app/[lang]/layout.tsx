import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { barlow, velocity } from "@/lib/fonts";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const description = {
  es: "Saúl Vargas, ciclista cadete de 14 años (ruta, TT y MTB) de Costa Rica. Sin Miedo · Sin Atajos · Sin Excusas.",
  en: "Saúl Vargas, 14-year-old cadet cyclist (road, TT and MTB) from Costa Rica. No Fear · No Shortcuts · No Excuses.",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const l = hasLocale(lang) ? lang : "es";
  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
    title: { default: "Saúl Vargas — Ciclista", template: "%s · Saúl Vargas" },
    description: description[l],
    alternates: { languages: { es: "/es", en: "/en" } },
    openGraph: {
      title: "Saúl Vargas",
      description: description[l],
      images: ["/images/hero-bg-2011-landscape.webp"],
      locale: l === "es" ? "es_CR" : "en_US",
      type: "website",
    },
  };
}

export const viewport: Viewport = { themeColor: "#000000" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${barlow.variable} ${velocity.variable}`}>
      <body>{children}</body>
    </html>
  );
}
