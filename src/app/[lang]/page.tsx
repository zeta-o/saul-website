import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LangSwitch } from "@/components/site/lang-switch";
import { MobileMenu } from "@/components/site/mobile-menu";
import { NavLinks } from "@/components/site/nav-links";
import { SocialIcons } from "@/components/site/social-icons";
import { hasLocale, href, nav, TAGLINE } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <main className="relative h-svh min-h-[520px] overflow-hidden bg-black">
      <HeroBackground />
      <div className="absolute inset-x-0 bottom-0 z-2 h-[68%] bg-[linear-gradient(to_top,rgba(8,8,8,1),rgba(15,15,15,0))]" />

      <div className="absolute top-4 left-4 z-10 md:top-6 md:left-8">
        <Link href={href(lang, "")} aria-label={nav[lang].inicio}>
          <Image src="/images/logo.png" alt="Saúl Vargas" width={1289} height={1220} priority className="h-[53px] w-auto md:h-[67px]" />
        </Link>
      </div>

      <NavLinks
        lang={lang}
        className="absolute inset-x-0 top-[38px] z-10 mx-auto hidden w-max items-center justify-center gap-7 text-[15px] leading-none font-semibold tracking-[.1em] text-white/85 uppercase lg:flex"
      />

      <div className="absolute top-8 right-8 z-10 hidden items-center gap-[18px] lg:flex">
        <SocialIcons size={20} />
        <LangSwitch lang={lang} />
      </div>
      <MobileMenu lang={lang} className="absolute top-5 right-4 z-10 lg:hidden" />

      <div className="absolute inset-x-0 bottom-14 z-10 flex flex-col items-center px-4">
        <Image
          src="/images/saul-vargas-wordmark.png"
          alt="Saúl Vargas"
          width={2172}
          height={724}
          priority
          sizes="(max-width: 666px) 280px, 42vw"
          className="mt-5 h-auto w-[clamp(280px,42vw,560px)]"
        />
        {/* Solapa el lema con el margen transparente del wordmark (-51px a 560px de ancho) */}
        <p className="relative mt-[calc(clamp(280px,42vw,560px)*-0.091)] inline-block text-center text-[clamp(15px,4.2vw,22px)] leading-none font-semibold tracking-[.08em] text-white/80 uppercase">
          {TAGLINE}
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-tagline-shine bg-[linear-gradient(100deg,rgba(255,255,255,0)_40%,#fff_50%,rgba(255,255,255,0)_60%)] bg-size-[250%_100%] bg-clip-text bg-no-repeat text-transparent mix-blend-screen"
          >
            {TAGLINE}
          </span>
        </p>
      </div>
    </main>
  );
}

/**
 * Fondo del hero con dirección de arte: en pantallas verticales usa la versión
 * vertical (2011 completo y horizontal, ciclista en portrait); en horizontales, la original.
 */
function HeroBackground() {
  const common = { alt: "", fill: true, priority: true, sizes: "100vw" };
  const {
    props: { srcSet: portrait },
  } = getImageProps({ ...common, src: "/images/hero-bg-2011-mobile.webp" });
  const {
    props: { srcSet: landscape, alt, ...rest },
  } = getImageProps({ ...common, src: "/images/hero-bg-2011.png" });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portrait} />
      <source media="(orientation: landscape)" srcSet={landscape} />
      <img {...rest} alt={alt} className="z-1 object-cover" />
    </picture>
  );
}
