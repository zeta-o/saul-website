import type { Metadata } from "next";

import { AccessAdmin } from "@/components/admin/access-admin";
import { AdminTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import type { AccessRequestRow, AllowedEmailRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Accesos" };

export default async function AdminAccesosPage() {
  const { supabase } = await requireAdmin();
  const [solicitudes, permitidos] = await Promise.all([
    supabase.from("access_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("allowed_emails").select("*").order("created_at", { ascending: false }),
  ]);
  return (
    <>
      <AdminTitle eyebrow="Mis estadísticas" title="Accesos" />
      <p className="mt-0 mb-6 max-w-[680px] text-base leading-[1.5] text-white/60">
        Aquí llegan las solicitudes del formulario &ldquo;Solicitar acceso&rdquo;. Al aprobar una, ese correo queda en la lista de acceso
        y podrá entrar a ver los números cuando se active la página para entrenadores.
      </p>
      <AccessAdmin
        solicitudes={(solicitudes.data ?? []) as AccessRequestRow[]}
        permitidos={(permitidos.data ?? []) as AllowedEmailRow[]}
      />
    </>
  );
}
