import Image from "next/image";
import Link from "next/link";

import { LangSwitch } from "@/components/site/lang-switch";
import { MobileMenu } from "@/components/site/mobile-menu";
import { NavLinks } from "@/components/site/nav-links";
import { SocialIcons } from "@/components/site/social-icons";
import { href, nav, type Locale } from "@/lib/i18n";

/** Header de páginas internas. */
export function SiteHeader({ lang }: { lang: Locale }) {
  return (
    <header className="relative mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 md:px-8">
      <Link href={href(lang, "")} aria-label={nav[lang].inicio} className="relative z-10">
        <Image src="/images/logo.png" alt="Saúl Vargas" width={1289} height={1220} priority className="h-[53px] w-auto" />
      </Link>
      <NavLinks
        lang={lang}
        className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center gap-7 text-[15px] leading-none font-semibold tracking-[.1em] text-white/85 uppercase lg:flex"
      />
      <div className="relative z-10 hidden items-center gap-[18px] lg:flex">
        <SocialIcons size={18} />
        <LangSwitch lang={lang} />
      </div>
      <MobileMenu lang={lang} className="lg:hidden" />
    </header>
  );
}
