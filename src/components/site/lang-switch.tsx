"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_COOKIE, locales, switchLocalePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function remember(lang: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LangSwitch({ lang, className }: { lang: Locale; className?: string }) {
  const pathname = usePathname();
  return (
    <div className={cn("flex items-center gap-1.5 border-l border-white/30 pl-4 text-sm leading-none font-semibold tracking-[.05em]", className)}>
      {locales.map((l, i) => (
        <span key={l} className="contents">
          {i > 0 && <span className="text-white/40" aria-hidden="true">/</span>}
          <Link
            href={switchLocalePath(pathname, l)}
            scroll={false}
            onClick={() => remember(l)}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            className={cn(
              "uppercase transition-colors",
              l === lang ? "text-brand-orange hover:text-brand-orange" : "text-white/50 hover:text-white/80"
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
