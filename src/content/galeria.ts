import type { Locale } from "@/lib/i18n";

export type Disciplina = "ruta" | "montana";

/** Modelo de datos pensado para migrar luego a Supabase / CMS. */
export type GalleryItem = {
  id: string;
  disciplina: Disciplina;
  src?: string;
  descripcion_es: string;
  descripcion_en: string;
  fotografo_handle: string;
  fotografo_url?: string;
};

export const galleryCopy = {
  es: { todas: "Todas", ruta: "Ruta", montana: "Montaña", foto: "Foto", placeholderRuta: "Foto de ruta", placeholderMontana: "Foto de montaña" },
  en: { todas: "All", ruta: "Road", montana: "Mountain", foto: "Photo", placeholderRuta: "Road photo", placeholderMontana: "Mountain photo" },
} satisfies Record<Locale, Record<string, string>>;

// Pendiente: fotos reales y handles/URLs de fotógrafos.
export const GALLERY: GalleryItem[] = [
  { id: "gal-ruta-1", disciplina: "ruta", descripcion_es: "Campeonato Nacional de Ruta — Mayo 2026", descripcion_en: "National Road Championship — May 2026", fotografo_handle: "@fotografo" },
  { id: "gal-ruta-2", disciplina: "ruta", descripcion_es: "Vuelta Juvenil — Mayo 2026", descripcion_en: "Vuelta Juvenil — May 2026", fotografo_handle: "@fotografo" },
  { id: "gal-ruta-3", disciplina: "ruta", src: "/images/saul-v7-trimmed.png", descripcion_es: "Critérium de Palmares", descripcion_en: "Palmares Criterium", fotografo_handle: "@fotografo" },
  { id: "gal-ruta-4", disciplina: "ruta", descripcion_es: "Critérium de San Isidro", descripcion_en: "San Isidro Criterium", fotografo_handle: "@fotografo" },
  { id: "gal-ruta-5", disciplina: "ruta", descripcion_es: "Critérium de Santo Domingo", descripcion_en: "Santo Domingo Criterium", fotografo_handle: "@fotografo" },
  { id: "gal-ruta-6", disciplina: "ruta", descripcion_es: "Critérium de Cartago", descripcion_en: "Cartago Criterium", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-1", disciplina: "montana", descripcion_es: "XCO — Primera fecha 2026", descripcion_en: "XCO — Round 1, 2026", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-2", disciplina: "montana", descripcion_es: "XCO — Segunda fecha 2026", descripcion_en: "XCO — Round 2, 2026", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-3", disciplina: "montana", descripcion_es: "Entrenamiento de montaña", descripcion_en: "Mountain training", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-4", disciplina: "montana", descripcion_es: "Entrenamiento de montaña", descripcion_en: "Mountain training", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-5", disciplina: "montana", descripcion_es: "Entrenamiento de montaña", descripcion_en: "Mountain training", fotografo_handle: "@fotografo" },
  { id: "gal-mtb-6", disciplina: "montana", descripcion_es: "Entrenamiento de montaña", descripcion_en: "Mountain training", fotografo_handle: "@fotografo" },
];
