"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { href, nav, routes, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Menú principal: Inicio se alcanza con el logo. Contacto no está en el menú. */
export const NAV_ITEMS = ["sobreMi", "galeria", "stats"] as const;

export function NavLinks({
  lang,
  className,
  linkClassName,
  onNavigate,
}: {
  lang: Locale;
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className={className} aria-label="Principal">
      {NAV_ITEMS.map((key) => {
        const to = href(lang, routes[key]);
        const active = pathname === to;
        return (
          <Link
            key={key}
            href={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "transition-colors hover:text-brand-orange",
              active && "text-brand-orange",
              linkClassName
            )}
          >
            {nav[lang][key]}
          </Link>
        );
      })}
    </nav>
  );
}
