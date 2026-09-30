import { AdminNav } from "@/components/admin/admin-nav";
import { NotConfigured } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const { email, supabase } = await requireAdmin();
  const { count: pendientes } = await supabase
    .from("access_requests")
    .select("id", { count: "exact", head: true })
    .eq("estado", "pendiente");

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminNav email={email} pendientes={pendientes ?? 0} />
      <main className="mx-auto w-full max-w-[1100px] px-4 pt-8 pb-24 md:px-8 lg:pt-12">{children}</main>
    </div>
  );
}
