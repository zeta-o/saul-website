import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contacto/contact-form";
import { InnerPage, PageTitle } from "@/components/site/inner-page";
import { SocialIcons } from "@/components/site/social-icons";
import { CONTACT_EMAIL, contactCopy } from "@/content/contacto";
import { hasLocale, nav } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? nav[lang].contacto : undefined };
}

export default async function ContactoPage({ params }: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = contactCopy[lang];

  return (
    <InnerPage lang={lang}>
      <section className="mx-auto grid max-w-[1000px] grid-cols-1 gap-12 px-4 pt-10 pb-20 md:grid-cols-2 md:gap-16 md:px-8 md:pt-14">
        <div>
          <PageTitle className="mb-5">{nav[lang].contacto}</PageTitle>
          <p className="mt-0 mb-8 max-w-[400px] text-lg leading-[1.6] text-white/78">{t.pitch}</p>
          <div className="flex flex-col gap-4 text-[17px] leading-none font-medium text-white">
            <a href={`mailto:${CONTACT_EMAIL}`} className="self-start transition-colors hover:text-brand-blue">
              {CONTACT_EMAIL}
            </a>
            <SocialIcons size={20} className="mt-2" />
          </div>
        </div>
        <ContactForm lang={lang} />
      </section>
    </InnerPage>
  );
}
