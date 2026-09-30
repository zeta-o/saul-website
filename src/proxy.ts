import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/proxy";

function getLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && hasLocale(cookie)) return cookie;

  // Primera visita: respetar Accept-Language
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of preferred) if (hasLocale(lang)) return lang;
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // El admin no lleva prefijo de idioma; solo necesita mantener viva la sesión.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return updateSession(request);

  const hasPrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  // Estadísticas: sesión de entrenadores con acceso.
  if (hasPrefix && /^\/[a-z]{2}\/estadisticas(\/|$)/.test(pathname)) return updateSession(request);
  if (hasPrefix) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Omitir internos de Next, rutas /api y archivos estáticos (con extensión)
  matcher: ["/((?!_next|api/|.*\\..*).*)"],
};
