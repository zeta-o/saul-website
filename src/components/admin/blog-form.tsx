"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { eliminarPost, guardarPost, type PostInput } from "@/app/admin/(panel)/blog/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { MediaUpload } from "@/components/admin/media-upload";
import { Field, Panel, PanelTitle, fechaHora } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Lang = "es" | "en";

export function BlogForm({ initial, publicadoAt }: { initial: PostInput; publicadoAt?: string | null }) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>(initial);
  const [pending, start] = useTransition();
  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setLang = (campo: "titulo" | "resumen" | "cuerpo", lang: Lang, v: string) =>
    set(`${campo}_${lang}` as keyof PostInput, v as never);

  const guardar = (estado: PostInput["estado"]) =>
    start(async () => {
      const res = await guardarPost({ ...form, estado });
      if (!res.ok) return void toast.error(res.error);
      set("estado", estado);
      toast.success(estado === "publicado" ? "Entrada publicada" : "Borrador guardado");
      if (!form.id) router.replace(`/admin/blog/${res.data!.id}`);
      else router.refresh();
    });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        guardar(form.estado);
      }}
    >
      <Panel className="grid gap-5 md:grid-cols-[320px_minmax(0,1fr)]">
        <Field label="Portada">
          <MediaUpload value={form.portada_path} onChange={(p) => set("portada_path", p)} folder="blog" className="h-[200px]" />
        </Field>
        <div className="flex flex-col gap-4">
          <Field label="Dirección (slug)" htmlFor="slug" hint="Se genera del título si la dejas vacía. Solo minúsculas, números y guiones.">
            <Input id="slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="campeonato-nacional-2026" />
          </Field>
          <div className="text-sm text-white/50">
            Estado: <strong className="text-white/85">{form.estado === "publicado" ? "Publicado" : "Borrador"}</strong>
            {publicadoAt && <> · publicado el {fechaHora(publicadoAt)}</>}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        {(["es", "en"] as const).map((lang) => (
          <Panel key={lang}>
            <PanelTitle>{lang === "es" ? "Español" : "Inglés"}</PanelTitle>
            <div className="flex flex-col gap-4">
              <Field label={lang === "es" ? "Título *" : "Título"} htmlFor={`titulo-${lang}`}>
                <Input id={`titulo-${lang}`} value={form[`titulo_${lang}`]} onChange={(e) => setLang("titulo", lang, e.target.value)} />
              </Field>
              <Field label="Resumen" htmlFor={`resumen-${lang}`} hint="Una o dos frases para la tarjeta del blog.">
                <Textarea id={`resumen-${lang}`} rows={3} value={form[`resumen_${lang}`]} onChange={(e) => setLang("resumen", lang, e.target.value)} />
              </Field>
              <Field
                label="Texto"
                htmlFor={`cuerpo-${lang}`}
                hint={
                  <>
                    Línea en blanco entre párrafos; <code className="text-brand-orange">## </code> al inicio para un subtítulo.
                  </>
                }
              >
                <Textarea
                  id={`cuerpo-${lang}`}
                  rows={18}
                  value={form[`cuerpo_${lang}`]}
                  onChange={(e) => setLang("cuerpo", lang, e.target.value)}
                  className="text-[17px] leading-[1.55]"
                />
              </Field>
            </div>
          </Panel>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 bg-surface/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        {form.id && (
          <ConfirmButton
            className="mr-auto"
            title="Eliminar entrada"
            description="Se borrará la entrada y su portada. No se puede deshacer."
            action={() => eliminarPost(form.id!)}
            onDone={() => {
              toast.success("Entrada eliminada");
              router.replace("/admin/blog");
            }}
          >
            <Trash2Icon className="size-3.5" /> Eliminar
          </ConfirmButton>
        )}
        <Button asChild variant="outline" size="xs">
          <Link href="/admin/blog">Volver</Link>
        </Button>
        {form.estado === "publicado" ? (
          <>
            <Button type="button" variant="outline" size="xs" disabled={pending} onClick={() => guardar("borrador")}>
              Pasar a borrador
            </Button>
            <Button type="submit" size="xs" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" variant="outline" size="xs" disabled={pending}>
              {pending ? "Guardando…" : "Guardar borrador"}
            </Button>
            <Button type="button" variant="accent" size="xs" disabled={pending} onClick={() => guardar("publicado")}>
              Publicar
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
