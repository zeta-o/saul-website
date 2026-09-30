import "server-only";

import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * Canjea el enlace del correo por la sesión. Con el correo incluido en Supabase (plan
 * gratis) no se puede cambiar la plantilla y llega un enlace en vez del código de 6 dígitos.
 */
export async function sesionDesdeEnlace(request: NextRequest, supabase: SupabaseClient) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  if (code) return !(await supabase.auth.exchangeCodeForSession(code)).error;
  if (tokenHash && type) return !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  return false;
}
