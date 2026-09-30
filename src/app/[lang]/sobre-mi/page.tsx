import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Eyebrow, InnerPage } from "@/components/site/inner-page";
import { EquipoSection } from "@/components/sobre-mi/equipo";
import { Timeline } from "@/components/sobre-mi/timeline";
import { aboutCopy } from "@/content/sobre-mi";
import { hasLocale, nav } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/sobre-mi">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? nav[lang].sobreMi : undefined };
}

export default async function SobreMiPage({ params }: PageProps<"/[lang]/sobre-mi">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = aboutCopy[lang];

  const datos = [
    { label: t.edad, value: "14" },
    { label: t.categoria, value: t.cadete },
    { label: t.disciplina, value: t.rutaMonte },
  ];

  return (
    <InnerPage lang={lang}>
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 pt-10 pb-10 md:px-8 md:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <Eyebrow className="mb-3.5">{nav[lang].sobreMi}</Eyebrow>
          <h1 className="m-0">
            <Image
              src="/images/saul-vargas-wordmark-trim.png"
              alt="Saúl Vargas"
              width={2172}
              height={290}
              priority
              sizes="(max-width: 750px) 240px, 32vw"
              className="mb-5 -ml-2 block h-auto w-[clamp(240px,32vw,420px)]"
            />
          </h1>
          <p className="mt-0 mb-8 max-w-[480px] text-[19px] leading-[1.6] text-white/78">{t.bio}</p>
          <dl className="m-0 flex flex-wrap gap-x-10 gap-y-5">
            {datos.map((d, i) => (
              <div key={d.label} className={i > 0 ? "border-l-2 border-brand-orange pl-6" : undefined}>
                <dt className="mb-1.5 block text-[11px] leading-none font-semibold tracking-[.14em] text-brand-orange uppercase">{d.label}</dt>
                <dd className="m-0 text-[28px] leading-none font-bold text-white">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl md:h-[520px]">
          <Image
            src="/images/saul-perfil.png"
            alt="Saúl Vargas"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </section>

      <EquipoSection lang={lang} />

      <Timeline lang={lang} />
    </InnerPage>
  );
}
