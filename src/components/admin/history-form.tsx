"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { guardarAno, type AnoInput } from "@/app/admin/(panel)/historia/actions";
import { MediaUpload } from "@/components/admin/media-upload";
import { Field, Panel, PanelTitle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Lang = "es" | "en";
const LANGS: { key: Lang; label: string }[] = [
  { key: "es", label: "Español" },
  { key: "en", label: "Inglés" },
];

export function HistoryForm({ initial }: { initial: AnoInput }) {
  const router = useRouter();
  const [form, setForm] = useState<AnoInput>(initial);
  // Los logros se editan como texto (uno por línea) y se separan al guardar.
  const [logros, setLogros] = useState({ es: initial.logros_es.join("\n"), en: initial.logros_en.join("\n") });
  const [pending, start] = useTransition();
  const set = <K extends keyof AnoInput>(k: K, v: AnoInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setLang = (campo: "label" | "titulo" | "cuerpo" | "cierre", lang: Lang, v: string) =>
    set(`${campo}_${lang}` as keyof AnoInput, v as never);

  const setFoto = (i: number, path: string | null) => {
    const fotos = [...form.fotos];
    if (path) fotos[i] = path;
    else fotos.splice(i, 1);
    set("fotos", fotos.filter(Boolean));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await guardarAno({
        ...form,
        logros_es: logros.es.split("\n"),
        logros_en: logros.en.split("\n"),
      });
      if (!res.ok) return void toast.error(res.error);
      toast.success("Año guardado. La página pública ya está actualizada.");
      if (!form.id) router.replace(`/admin/historia/${res.data!.id}`);
      else router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {LANGS.map(({ key, label }) => (
          <Panel key={key}>
            <PanelTitle>{label}</PanelTitle>
            <div className="flex flex-col gap-4">
              <Field
                label={key === "es" ? "Año / etiqueta *" : "Año / etiqueta"}
                htmlFor={`label-${key}`}
                hint={key === "es" ? "Lo que aparece en la línea de tiempo: 2028, Niñez…" : "Vacío = igual que en español."}
              >
                <Input id={`label-${key}`} value={form[`label_${key}`]} onChange={(e) => setLang("label", key, e.target.value)} maxLength={40} />
              </Field>
              <Field label="Título" htmlFor={`titulo-${key}`}>
                <Input id={`titulo-${key}`} value={form[`titulo_${key}`]} onChange={(e) => setLang("titulo", key, e.target.value)} />
              </Field>
              <Field
                label="Texto"
                htmlFor={`cuerpo-${key}`}
                hint={
                  <>
                    Deja una línea en blanco entre párrafos. Para un subtítulo, empieza la línea con{" "}
                    <code className="text-brand-orange">## </code> (ej. <code className="text-brand-orange">## Critériums</code>).
                  </>
                }
              >
                <Textarea
                  id={`cuerpo-${key}`}
                  rows={16}
                  value={form[`cuerpo_${key}`]}
                  onChange={(e) => setLang("cuerpo", key, e.target.value)}
                  className="text-[17px] leading-[1.55]"
                />
              </Field>
              <Field label="Logros" htmlFor={`logros-${key}`} hint="Uno por línea. Se muestran con viñeta azul.">
                <Textarea id={`logros-${key}`} rows={4} value={logros[key]} onChange={(e) => setLogros((l) => ({ ...l, [key]: e.target.value }))} />
              </Field>
              <Field label="Frase de cierre" htmlFor={`cierre-${key}`} hint="Opcional. Se muestra grande al final (como en 2027).">
                <Input id={`cierre-${key}`} value={form[`cierre_${key}`]} onChange={(e) => setLang("cierre", key, e.target.value)} />
              </Field>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelTitle>Fotos y video</PanelTitle>
        <p className="mt-0 mb-4 text-sm text-white/50">
          La primera foto es la grande. Si subes un video, ocupa el lugar de la foto grande y se reproduce al pasar el mouse.
        </p>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
          {[0, 1, 2].map((i) => (
            <MediaUpload
              key={i}
              value={form.fotos[i] ?? null}
              onChange={(p) => setFoto(i, p)}
              folder="historia"
              label={i === 0 ? "Foto grande" : `Foto ${i + 1}`}
              className="h-[220px]"
            />
          )).slice(0, Math.min(3, form.fotos.length + 1))}
        </div>
        <div className="mt-4 max-w-[420px]">
          <Field label="Video (opcional)">
            <MediaUpload value={form.video_path} onChange={(p) => set("video_path", p)} folder="historia" kind="video" className="h-[180px]" />
          </Field>
        </div>
      </Panel>

      <Panel className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-base text-white/85">
          <Checkbox checked={form.inicial} onCheckedChange={(v) => set("inicial", v === true)} />
          Año seleccionado al abrir la página
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-base text-white/85">
          <Checkbox checked={form.publicado ?? true} onCheckedChange={(v) => set("publicado", v === true)} />
          Visible en el sitio
        </label>
      </Panel>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t border-white/10 bg-surface/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        <Button asChild variant="outline" size="xs">
          <Link href="/admin/historia">Volver</Link>
        </Button>
        <Button type="submit" size="xs" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
