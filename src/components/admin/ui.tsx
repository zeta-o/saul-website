import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Título de página del admin. */
export function AdminTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="mb-3 block text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">{eyebrow}</span>
        )}
        <h1 className="m-0 text-[clamp(32px,4vw,44px)] leading-none font-extrabold tracking-[-.02em] uppercase italic">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("rounded-2xl border border-white/12 bg-white/[.04] p-5 md:p-6", className)} {...props} />;
}

export function PanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("mt-0 mb-4 text-xs leading-none font-semibold tracking-[.16em] text-white/55 uppercase", className)}
      {...props}
    />
  );
}

/** Campo de formulario con etiqueta y ayuda opcional. */
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <span className="text-[13px] leading-[1.4] text-white/45">{hint}</span>}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-base text-white/55">{children}</div>
  );
}

/** Aviso cuando falta configurar Supabase. */
export function NotConfigured() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="max-w-[520px] text-lg leading-[1.6] text-white/75">
        <h1 className="mt-0 mb-4 text-4xl font-extrabold uppercase italic text-white">Admin</h1>
        Falta conectar Supabase: define <code className="text-brand-orange">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
        <code className="text-brand-orange">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (ver README).
      </div>
    </main>
  );
}

// Formato propio (no toLocaleString) para que servidor y navegador den el mismo texto
// y no haya errores de hidratación.
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];

/** Fecha sin hora (columna date, "2026-09-30") → "30 sept 2026". */
export function fechaCorta(fecha: string) {
  const [y, m, d] = fecha.slice(0, 10).split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}

/** Timestamp → "30 sept 2026, 14:05" en hora de Costa Rica (UTC−6, sin horario de verano). */
export function fechaHora(iso: string) {
  const cr = new Date(Date.parse(iso) - 6 * 3600_000);
  const hh = String(cr.getUTCHours()).padStart(2, "0");
  const mm = String(cr.getUTCMinutes()).padStart(2, "0");
  return `${cr.getUTCDate()} ${MESES[cr.getUTCMonth()]} ${cr.getUTCFullYear()}, ${hh}:${mm}`;
}

/** Mes corto para ejes: "sept 26". */
export function mesCorto(t: number) {
  const d = new Date(t);
  return `${MESES[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
}
