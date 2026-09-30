"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { eliminarFoto, guardarFoto, moverFoto, type FotoInput } from "@/app/admin/(panel)/galeria/actions";
import { AdminDialog } from "@/components/admin/admin-dialog";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { MediaUpload } from "@/components/admin/media-upload";
import { EmptyState, Field } from "@/components/admin/ui";
import { UnderlineTabs } from "@/components/site/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Disciplina, GalleryRow } from "@/lib/data/types";
import { mediaUrl } from "@/lib/supabase/config";

const nueva = (disciplina: Disciplina): FotoInput => ({
  disciplina,
  image_path: null,
  descripcion_es: "",
  descripcion_en: "",
  fotografo_handle: "",
  fotografo_url: "",
  publicado: true,
});

export function GalleryAdmin({ items }: { items: GalleryRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Disciplina>("ruta");
  const [editing, setEditing] = useState<FotoInput | null>(null);
  const [pending, start] = useTransition();
  const list = items.filter((i) => i.disciplina === tab);

  const mover = (id: string, dir: -1 | 1) =>
    start(async () => {
      const res = await moverFoto(id, dir);
      if (!res.ok) toast.error(res.error);
      router.refresh();
    });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <UnderlineTabs<Disciplina>
          items={[
            { value: "ruta", label: `Ruta (${items.filter((i) => i.disciplina === "ruta").length})` },
            { value: "montana", label: `Montaña (${items.filter((i) => i.disciplina === "montana").length})` },
          ]}
          value={tab}
          onChange={setTab}
          label="Disciplina"
          className="gap-7 text-sm tracking-[.1em] [&>button]:pb-2"
        />
        <Button size="sm" onClick={() => setEditing(nueva(tab))}>
          <PlusIcon className="size-4" /> Agregar foto
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState>Aún no hay fotos en esta categoría.</EmptyState>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 p-0">
          {list.map((item, i) => {
            const url = mediaUrl(item.image_path);
            return (
              <li key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-white/12 bg-white/[.04]">
                <div className="relative h-[180px] bg-white/[.04]">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- miniatura del admin
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold tracking-[.12em] text-white/35 uppercase">
                      Sin foto
                    </div>
                  )}
                  {!item.publicado && <Badge className="absolute top-2 left-2 bg-black/70">Oculta</Badge>}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <span className="text-[17px] leading-[1.3] text-white/90">{item.descripcion_es}</span>
                  {item.descripcion_en && <span className="text-sm text-white/45">{item.descripcion_en}</span>}
                  {item.fotografo_handle && <span className="text-sm text-white/45">Foto: {item.fotografo_handle}</span>}
                </div>
                <div className="flex items-center gap-1 border-t border-white/10 px-2 py-2">
                  <Button variant="ghost" size="icon" aria-label="Mover antes" disabled={pending || i === 0} onClick={() => mover(item.id, -1)}>
                    <ArrowLeftIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Mover después"
                    disabled={pending || i === list.length - 1}
                    onClick={() => mover(item.id, 1)}
                  >
                    <ArrowRightIcon className="size-4" />
                  </Button>
                  <Button variant="ghost" size="xs" className="ml-auto" onClick={() => setEditing({ ...item })}>
                    <PencilIcon className="size-3.5" /> Editar
                  </Button>
                  <ConfirmButton
                    size="icon"
                    ariaLabel="Eliminar"
                    title="Eliminar foto"
                    description={`Se borrará "${item.descripcion_es}" y su archivo. No se puede deshacer.`}
                    action={() => eliminarFoto(item.id)}
                    onDone={() => {
                      toast.success("Foto eliminada");
                      router.refresh();
                    }}
                  >
                    <Trash2Icon className="size-4" />
                  </ConfirmButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <FotoDialog
          value={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function FotoDialog({ value, onClose, onSaved }: { value: FotoInput; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(value);
  const [pending, start] = useTransition();
  const set = <K extends keyof FotoInput>(k: K, v: FotoInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminDialog open onOpenChange={(o) => !o && onClose()} title={value.id ? "Editar foto" : "Agregar foto"}>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await guardarFoto(form);
            if (!res.ok) return void toast.error(res.error);
            toast.success("Foto guardada");
            onSaved();
          });
        }}
      >
        <MediaUpload value={form.image_path} onChange={(p) => set("image_path", p)} folder="galeria" className="h-[240px]" />
        <Field label="Disciplina" htmlFor="disciplina">
          <div className="flex gap-2" id="disciplina">
            {(["ruta", "montana"] as const).map((d) => (
              <Button
                key={d}
                type="button"
                size="xs"
                variant={form.disciplina === d ? "primary" : "outline"}
                onClick={() => set("disciplina", d)}
              >
                {d === "ruta" ? "Ruta" : "Montaña"}
              </Button>
            ))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Descripción (ES) *" htmlFor="desc-es">
            <Input id="desc-es" required value={form.descripcion_es} onChange={(e) => set("descripcion_es", e.target.value)} placeholder="Critérium de Palmares" />
          </Field>
          <Field label="Descripción (EN)" htmlFor="desc-en" hint="Si la dejas vacía, se muestra la de español.">
            <Input id="desc-en" value={form.descripcion_en} onChange={(e) => set("descripcion_en", e.target.value)} placeholder="Palmares Criterium" />
          </Field>
          <Field label="Fotógrafo" htmlFor="foto-handle">
            <Input id="foto-handle" value={form.fotografo_handle} onChange={(e) => set("fotografo_handle", e.target.value)} placeholder="@fotografo" />
          </Field>
          <Field label="Enlace del fotógrafo" htmlFor="foto-url" hint="Instagram o Facebook.">
            <Input id="foto-url" inputMode="url" autoCapitalize="none" value={form.fotografo_url} onChange={(e) => set("fotografo_url", e.target.value)} placeholder="https://instagram.com/…" />
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-base text-white/85">
          <Checkbox checked={form.publicado} onCheckedChange={(v) => set("publicado", v === true)} />
          Visible en el sitio
        </label>
        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Button type="button" variant="outline" size="xs" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="xs" disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </AdminDialog>
  );
}
