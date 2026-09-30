import { NextResponse, type NextRequest } from "next/server";

import { sesionDesdeEnlace } from "@/lib/supabase/confirm";
import { createClient } from "@/lib/supabase/server";

/** Destino del enlace del correo del admin. */
export async function GET(request: NextRequest) {
  const fallo = new URL("/admin/login?error=enlace", request.url);
  const supabase = await createClient();
  if (!(await sesionDesdeEnlace(request, supabase))) return NextResponse.redirect(fallo);

  const { data: esAdmin } = await supabase.rpc("is_admin");
  if (!esAdmin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(fallo);
  }
  return NextResponse.redirect(new URL("/admin", request.url));
}
