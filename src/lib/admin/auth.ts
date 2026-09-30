import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Sesión actual si es de un administrador; null en cualquier otro caso. */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (!email) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin ? { email, supabase } : null;
});

/** Para páginas y server actions del admin: redirige al login si no hay sesión válida. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
