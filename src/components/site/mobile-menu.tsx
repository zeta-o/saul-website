"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LangSwitch } from "@/components/site/lang-switch";
import { NavLinks } from "@/components/site/nav-links";
import { SocialIcons } from "@/components/site/social-icons";
import { href, nav, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileMenu({ lang, className }: { lang: Locale; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn("flex size-10 cursor-pointer items-center justify-center rounded-lg text-white outline-none focus-visible:ring-2 focus-visible:ring-ring/60", className)}
        aria-label={nav[lang].menu}
      >
        <MenuIcon className="size-7" strokeWidth={1.8} />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="sr-only">{nav[lang].menu}</SheetTitle>
        <Link href={href(lang, "")} onClick={() => setOpen(false)} aria-label={nav[lang].inicio} className="self-start">
          <Image src="/images/logo.png" alt="Saúl Vargas" width={1289} height={1220} className="h-[53px] w-auto" />
        </Link>
        <NavLinks
          lang={lang}
          onNavigate={() => setOpen(false)}
          className="mt-6 flex flex-col gap-6 text-[22px] leading-none font-semibold tracking-[.1em] text-white/85 uppercase"
        />
        <div className="mt-auto flex items-center gap-[18px]">
          <SocialIcons size={20} />
          <LangSwitch lang={lang} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
