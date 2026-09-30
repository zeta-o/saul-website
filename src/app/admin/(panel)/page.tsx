import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { AdminTitle, Panel, PanelTitle, fechaCorta, fechaHora } from "@/components/admin/ui";
import { nf } from "@/components/admin/numeros/metrics";
import { requireAdmin } from "@/lib/admin/auth";
import type { AccessRequestRow, MeasurementRow } from "@/lib/data/types";

export const metadata: Metadata = { title: "Resumen" };

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin();
  const count = (table: string, filter?: [string, string | boolean]) => {
    const q = supabase.from(table).select("*", { count: "exact", head: true });
    return filter ? q.eq(filter[0], filter[1]) : q;
  };

  const [pendientes, conAcceso, fotos, fotosSinImagen, anos, publicados, borradores, ultima, recientes] = await Promise.all([
    count("access_requests", ["estado", "pendiente"]),
    count("allowed_emails"),
    count("gallery_items"),
    supabase.from("gallery_items").select("*", { count: "exact", head: true }).is("image_path", null),
    count("history_years"),
    count("blog_posts", ["estado", "publicado"]),
    count("blog_posts", ["estado", "borrador"]),
    supabase.from("measurements").select("*").order("fecha", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("access_requests").select("*").eq("estado", "pendiente").order("created_at", { ascending: false }).limit(5),
  ]);

  const m = ultima.data as MeasurementRow | null;
  const cards = [
    { href: "/admin/accesos", label: "Solicitudes pendientes", value: pendientes.count ?? 0, note: `${conAcceso.count ?? 0} con acceso` },
    { href: "/admin/galeria", label: "Fotos en la galería", value: fotos.count ?? 0, note: fotosSinImagen.count ? `${fotosSinImagen.count} sin imagen todavía` : "Todas con imagen" },
    { href: "/admin/historia", label: "Años en Mi historia", value: anos.count ?? 0, note: "Línea de tiempo" },
    { href: "/admin/blog", label: "Entradas publicadas", value: publicados.count ?? 0, note: `${borradores.count ?? 0} borradores` },
  ];

  return (
    <>
      <AdminTitle eyebrow="Admin" title="Resumen" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <Panel className="flex h-full flex-col gap-2 transition-colors group-hover:bg-white/[.08]">
              <span className="text-[11px] leading-none font-semibold tracking-[.14em] text-white/55 uppercase">{c.label}</span>
              <span className="text-[40px] leading-none font-bold">{c.value}</span>
              <span className="text-[13px] text-white/45">{c.note}</span>
            </Panel>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle>Solicitudes pendientes</PanelTitle>
          {recientes.data?.length ? (
            <ul className="m-0 flex list-none flex-col p-0">
              {(recientes.data as AccessRequestRow[]).map((s) => (
                <li key={s.id} className="border-b border-white/[.06] py-2.5 last:border-0">
                  <div className="font-semibold">{s.nombre}</div>
                  <div className="text-sm text-white/50">
                    {s.rol ? `${s.rol} · ` : ""}
                    {fechaHora(s.created_at)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-white/50">No hay solicitudes por revisar.</p>
          )}
          <Link href="/admin/accesos" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[.08em] text-brand-orange uppercase">
            Ver accesos <ArrowRightIcon className="size-4" />
          </Link>
        </Panel>

        <Panel>
          <PanelTitle>Última medición</PanelTitle>
          {m ? (
            <>
              <div className="mb-4 text-sm text-white/50">{fechaCorta(m.fecha)}</div>
              <dl className="m-0 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["FTP", m.ftp_w, "W", 0],
                  ["W/kg", m.ftp_w && m.peso_kg ? m.ftp_w / m.peso_kg : null, "", 2],
                  ["Peso", m.peso_kg, "kg", 1],
                  ["20 min", m.p20m_w, "W", 0],
                  ["5 s", m.p5s_w, "W", 0],
                  ["h / semana", m.horas_semana, "h", 1],
                ].map(([label, v, unit, d]) => (
                  <div key={label as string} className="border-t-2 border-brand-blue pt-2">
                    <dt className="text-[10px] font-semibold tracking-[.16em] text-white/50 uppercase">{label}</dt>
                    <dd className="m-0 text-2xl font-bold">
                      {v === null ? "—" : `${nf(Number(v), d as number)}${unit ? ` ${unit}` : ""}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="m-0 text-white/50">Aún no hay mediciones.</p>
          )}
          <Link href="/admin/numeros" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[.08em] text-brand-orange uppercase">
            Ver números <ArrowRightIcon className="size-4" />
          </Link>
        </Panel>
      </div>
    </>
  );
}
