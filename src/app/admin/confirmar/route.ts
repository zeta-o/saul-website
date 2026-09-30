import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Destino del enlace del correo. Con el correo incluido en Supabase (plan gratis)
 * no se puede cambiar la plantilla y llega un enlace en vez del código de 6 dígitos:
 * aquí se canjea ese enlace por la sesión.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const fallo = new URL("/admin/login?error=enlace", request.url);

  const supabase = await createClient();
  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  if (!ok) return NextResponse.redirect(fallo);

  const { data: esAdmin } = await supabase.rpc("is_admin");
  if (!esAdmin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(fallo);
  }
  return NextResponse.redirect(new URL("/admin", request.url));
}
