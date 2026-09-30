import type { HistoryYearRow } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/supabase/config";

export type HistoryBlock = { subtitulo?: string; parrafos: string[] };

/** Año listo para mostrar en la línea de tiempo (un idioma). */
export type HistoryEntry = {
  id: string;
  label: string;
  titulo: string;
  bloques: HistoryBlock[];
  cierre: string;
  logros: string[];
  video?: string;
  fotos: string[];
};

/**
 * Convierte el texto del admin en bloques: párrafos separados por línea en blanco,
 * y las líneas que empiezan con "## " abren un subtítulo.
 */
export function parseCuerpo(texto: string): HistoryBlock[] {
  const bloques: HistoryBlock[] = [{ parrafos: [] }];
  for (const raw of texto.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const chunk = raw.trim();
    if (!chunk) continue;
    const lines = chunk.split("\n");
    if (lines[0].startsWith("## ")) {
      bloques.push({ subtitulo: lines[0].slice(3).trim(), parrafos: [] });
      const resto = lines.slice(1).join(" ").trim();
      if (resto) bloques[bloques.length - 1].parrafos.push(resto);
    } else {
      bloques[bloques.length - 1].parrafos.push(lines.join(" "));
    }
  }
  return bloques.filter((b, i) => i > 0 || b.parrafos.length > 0);
}

export function toHistoryEntry(row: HistoryYearRow, lang: Locale): HistoryEntry {
  const en = lang === "en";
  // Si falta la traducción, se muestra el español.
  const pick = (es: string, enText: string) => (en && enText.trim() ? enText : es);
  return {
    id: row.id ?? `static-${row.orden}`,
    label: pick(row.label_es, row.label_en),
    titulo: pick(row.titulo_es, row.titulo_en),
    bloques: parseCuerpo(pick(row.cuerpo_es, row.cuerpo_en)),
    cierre: pick(row.cierre_es, row.cierre_en),
    logros: en && row.logros_en.length ? row.logros_en : row.logros_es,
    video: mediaUrl(row.video_path),
    fotos: row.fotos.map((f) => mediaUrl(f)).filter((f): f is string => Boolean(f)),
  };
}
