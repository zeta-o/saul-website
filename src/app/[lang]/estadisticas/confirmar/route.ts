import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale } from "@/lib/i18n";
import { sesionDesdeEnlace } from "@/lib/supabase/confirm";
import { createClient } from "@/lib/supabase/server";

/** Destino del enlace del correo de entrenadores con acceso. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/estadisticas/confirmar">) {
  const { lang } = await params;
  const pagina = `/${hasLocale(lang) ? lang : defaultLocale}/estadisticas`;
  const supabase = await createClient();
  if (!(await sesionDesdeEnlace(request, supabase))) return NextResponse.redirect(new URL(`${pagina}?error=enlace`, request.url));

  const { data: tieneAcceso } = await supabase.rpc("is_allowed");
  if (!tieneAcceso) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`${pagina}?error=sinAcceso`, request.url));
  }
  return NextResponse.redirect(new URL(pagina, request.url));
}
