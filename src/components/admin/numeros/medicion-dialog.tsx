"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { guardarMedicion, type MedicionInput } from "@/app/admin/(panel)/numeros/actions";
import { AdminDialog } from "@/components/admin/admin-dialog";
import { METRICS } from "@/components/admin/numeros/metrics";
import { Field } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MeasurementRow } from "@/lib/data/types";

const GRUPOS = ["Perfil", "Potencia máxima", "Carga de entrenamiento"] as const;

export function MedicionDialog({
  value,
  onClose,
  onSaved,
}: {
  value: Partial<MeasurementRow>;
  onClose: () => void;
  onSaved: () => void;
}) {
  // Los números se editan como texto para permitir campos vacíos.
  const [campos, setCampos] = useState<Record<string, string>>(() =>
    Object.fromEntries(METRICS.map((m) => [m.key, value[m.key] == null ? "" : String(value[m.key])]))
  );
  const [fecha, setFecha] = useState(value.fecha ?? "");
  const [notas, setNotas] = useState(value.notas ?? "");
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = { id: value.id, fecha, notas } as MedicionInput;
    for (const m of METRICS) {
      const raw = campos[m.key].trim().replace(",", ".");
      (input as Record<string, unknown>)[m.key] = raw === "" ? null : Number(raw);
    }
    start(async () => {
      const res = await guardarMedicion(input);
      if (!res.ok) return void toast.error(res.error);
      toast.success("Medición guardada");
      onSaved();
    });
  };

  return (
    <AdminDialog
      open
      wide
      onOpenChange={(o) => !o && onClose()}
      title={value.id ? "Editar medición" : "Nueva medición"}
      description="Llena solo lo que mediste; lo demás puede quedar vacío."
    >
      <form onSubmit={submit} className="flex flex-col gap-6">
        <Field label="Fecha *" htmlFor="fecha" className="max-w-[220px]">
          <Input id="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className="[color-scheme:dark]" />
        </Field>
        {GRUPOS.map((g) => (
          <fieldset key={g} className="m-0 border-0 p-0">
            <legend className="mb-3 text-xs leading-none font-semibold tracking-[.16em] text-brand-orange uppercase">{g}</legend>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {METRICS.filter((m) => m.grupo === g).map((m) => (
                <Field key={m.key} label={m.unit ? `${m.label} (${m.unit})` : m.label} htmlFor={m.key}>
                  <Input
                    id={m.key}
                    inputMode="decimal"
                    value={campos[m.key]}
                    onChange={(e) => setCampos((c) => ({ ...c, [m.key]: e.target.value }))}
                    className="tabular-nums"
                  />
                </Field>
              ))}
            </div>
          </fieldset>
        ))}
        <Field label="Notas" htmlFor="notas">
          <Textarea id="notas" rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Test de FTP en rodillo, pretemporada…" />
        </Field>
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
