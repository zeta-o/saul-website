import { SiteHeader } from "@/components/site/site-header";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Fondo de mapa + header para las páginas internas. */
export function InnerPage({
  lang,
  children,
  className,
}: {
  lang: Locale;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-mapa min-h-svh", className)}>
      <SiteHeader lang={lang} />
      <main>{children}</main>
    </div>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("block text-[13px] leading-none font-semibold tracking-[.14em] text-brand-orange uppercase", className)}>
      {children}
    </span>
  );
}

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("m-0 text-[clamp(36px,5vw,52px)] leading-none font-extrabold tracking-[-.02em] text-white uppercase italic", className)}>
      {children}
    </h1>
  );
}
