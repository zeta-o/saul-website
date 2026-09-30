"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  ExternalLinkIcon,
  GaugeIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MilestoneIcon,
  UserCheckIcon,
} from "lucide-react";

import { cerrarSesion } from "@/app/admin/login/actions";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboardIcon },
  { href: "/admin/galeria", label: "Galería", icon: ImagesIcon },
  { href: "/admin/historia", label: "Mi historia", icon: MilestoneIcon },
  { href: "/admin/blog", label: "Blog", icon: BookOpenIcon },
  { href: "/admin/numeros", label: "Números", icon: GaugeIcon },
  { href: "/admin/accesos", label: "Accesos", icon: UserCheckIcon },
] as const;

function NavList({ pendientes, onNavigate }: { pendientes: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] leading-none font-semibold tracking-[.08em] uppercase transition-colors",
              active ? "bg-white/8 text-brand-orange hover:text-brand-orange" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.8} />
            {label}
            {href === "/admin/accesos" && pendientes > 0 && (
              <span className="ml-auto rounded-full bg-brand-orange px-2 py-0.5 text-xs tracking-normal text-white">{pendientes}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer({ email }: { email: string }) {
  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">
      <Link href="/" target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white">
        <ExternalLinkIcon className="size-4" /> Ver el sitio
      </Link>
      <span className="truncate text-white/40" title={email}>
        {email}
      </span>
      <form action={cerrarSesion}>
        <button type="submit" className="flex cursor-pointer items-center gap-2 text-white/60 hover:text-white">
          <LogOutIcon className="size-4" /> Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export function AdminNav({ email, pendientes }: { email: string; pendientes: number }) {
  const [open, setOpen] = useState(false);
  const logo = <Image src="/images/logo.png" alt="Saúl Vargas" width={1289} height={1220} className="h-10 w-auto" />;

  return (
    <>
      {/* Escritorio */}
      <aside className="sticky top-0 hidden h-svh flex-col gap-8 border-r border-white/10 bg-black/30 p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3">
          {logo}
          <span className="text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">Admin</span>
        </Link>
        <NavList pendientes={pendientes} />
        <Footer email={email} />
      </aside>

      {/* Móvil */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-3">
          {logo}
          <span className="text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">Admin</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex size-10 cursor-pointer items-center justify-center text-white" aria-label="Menú">
            <MenuIcon className="size-7" strokeWidth={1.8} />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle className="sr-only">Menú del admin</SheetTitle>
            <div className="mt-12 flex h-full flex-col gap-6">
              <NavList pendientes={pendientes} onNavigate={() => setOpen(false)} />
              <Footer email={email} />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
