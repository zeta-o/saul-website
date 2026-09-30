import Link from "next/link";

import "./globals.css";

// Fuera de /[lang] no hay layout raíz, así que este 404 trae el suyo.
export default function NotFound() {
  return (
    <html lang="es">
      <body className="bg-mapa flex min-h-svh flex-col items-center justify-center gap-6 font-sans">
        <h1 className="m-0 text-[clamp(36px,5vw,52px)] leading-none font-extrabold uppercase italic">404</h1>
        <Link href="/" className="rounded-lg bg-brand-blue px-[30px] py-[14px] text-[15px] leading-none font-semibold tracking-[.06em] uppercase">
          Inicio / Home
        </Link>
      </body>
    </html>
  );
}
