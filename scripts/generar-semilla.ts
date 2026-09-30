/**
 * Genera supabase/migrations/…_contenido_inicial.sql a partir de src/content,
 * para que el admin arranque con el contenido que ya tiene el sitio.
 *   npx tsx scripts/generar-semilla.ts
 */
import { writeFileSync } from "node:fs";

import { GALLERY } from "../src/content/galeria";
import { HISTORY_ROWS } from "../src/content/historia";

const q = (v: string | null) => (v === null ? "null" : `'${v.replaceAll("'", "''")}'`);
const arr = (v: string[]) => `array[${v.map(q).join(", ")}]::text[]`;

const history = HISTORY_ROWS.map(
  (r) =>
    `  (${[
      q(r.label_es), q(r.label_en), q(r.titulo_es), q(r.titulo_en), q(r.cuerpo_es), q(r.cuerpo_en),
      q(r.cierre_es), q(r.cierre_en), arr(r.logros_es), arr(r.logros_en), q(r.video_path), arr(r.fotos),
      r.orden, r.inicial,
    ].join(", ")})`
).join(",\n");

const gallery = GALLERY.map(
  (g) =>
    `  (${[
      q(g.disciplina), q(g.image_path), q(g.descripcion_es), q(g.descripcion_en),
      q(g.fotografo_handle), q(g.fotografo_url), g.orden,
    ].join(", ")})`
).join(",\n");

const sql = `-- Contenido inicial (generado con scripts/generar-semilla.ts). Solo inserta si las tablas están vacías.

insert into public.history_years
  (label_es, label_en, titulo_es, titulo_en, cuerpo_es, cuerpo_en, cierre_es, cierre_en,
   logros_es, logros_en, video_path, fotos, orden, inicial)
select * from (values
${history}
) v
where not exists (select 1 from public.history_years);

insert into public.gallery_items
  (disciplina, image_path, descripcion_es, descripcion_en, fotografo_handle, fotografo_url, orden)
select v.disciplina::public.disciplina, v.image_path, v.descripcion_es, v.descripcion_en,
       v.fotografo_handle, v.fotografo_url, v.orden
from (values
${gallery}
) v (disciplina, image_path, descripcion_es, descripcion_en, fotografo_handle, fotografo_url, orden)
where not exists (select 1 from public.gallery_items);
`;

writeFileSync("supabase/migrations/20260930160100_contenido_inicial.sql", sql);
console.log("ok");
