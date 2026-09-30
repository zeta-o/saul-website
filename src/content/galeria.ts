import type { GalleryRow } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n";

export const galleryCopy = {
  es: { todas: "Todas", ruta: "Ruta", montana: "Montaña", foto: "Foto", placeholderRuta: "Foto de ruta", placeholderMontana: "Foto de montaña" },
  en: { todas: "All", ruta: "Road", montana: "Mountain", foto: "Photo", placeholderRuta: "Road photo", placeholderMontana: "Mountain photo" },
} satisfies Record<Locale, Record<string, string>>;

// Pendiente: fotos reales y handles/URLs de fotógrafos.
const item = (
  id: string,
  disciplina: GalleryRow["disciplina"],
  orden: number,
  descripcion_es: string,
  descripcion_en: string,
  image_path: string | null = null
): GalleryRow => ({
  id,
  disciplina,
  orden,
  descripcion_es,
  descripcion_en,
  image_path,
  fotografo_handle: "@fotografo",
  fotografo_url: "",
  publicado: true,
});

/** Respaldo cuando Supabase no está configurado; también es la semilla inicial. */
export const GALLERY: GalleryRow[] = [
  item("gal-ruta-1", "ruta", 10, "Campeonato Nacional de Ruta — Mayo 2026", "National Road Championship — May 2026"),
  item("gal-ruta-2", "ruta", 20, "Vuelta Juvenil — Mayo 2026", "Vuelta Juvenil — May 2026"),
  item("gal-ruta-3", "ruta", 30, "Critérium de Palmares", "Palmares Criterium", "/images/saul-v7-trimmed.png"),
  item("gal-ruta-4", "ruta", 40, "Critérium de San Isidro", "San Isidro Criterium"),
  item("gal-ruta-5", "ruta", 50, "Critérium de Santo Domingo", "Santo Domingo Criterium"),
  item("gal-ruta-6", "ruta", 60, "Critérium de Cartago", "Cartago Criterium"),
  item("gal-mtb-1", "montana", 10, "XCO — Primera fecha 2026", "XCO — Round 1, 2026"),
  item("gal-mtb-2", "montana", 20, "XCO — Segunda fecha 2026", "XCO — Round 2, 2026"),
  item("gal-mtb-3", "montana", 30, "Entrenamiento de montaña", "Mountain training"),
  item("gal-mtb-4", "montana", 40, "Entrenamiento de montaña", "Mountain training"),
  item("gal-mtb-5", "montana", 50, "Entrenamiento de montaña", "Mountain training"),
  item("gal-mtb-6", "montana", 60, "Entrenamiento de montaña", "Mountain training"),
];
