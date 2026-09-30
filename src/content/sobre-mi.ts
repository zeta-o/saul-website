import type { Locale } from "@/lib/i18n";

export const aboutCopy = {
  es: {
    edad: "Edad", categoria: "Categoría", cadete: "Cadete", disciplina: "Disciplina",
    rutaMonte: "Ruta / TT / MTB", historico: "Mi historia", equipoTitulo: "Mi equipo",
    equipoHeadline: "Bicicletas y montaje", materialTitulo: "Material", verMas: "Ver más",
    cerrar: "Cerrar", fotoAnio: "Foto del año", fotoBici: "Foto de la bicicleta",
    bio: "Encontrar el ciclismo fue una travesía. Saúl Vargas, de 14 años, pasó por varios deportes antes de encontrar la pasión en el ciclismo, y ninguno de esos años fue tiempo perdido: cada uno le dejó herramientas que hoy usa sobre la bici. Compite en ruta y en montaña, entrena de forma constante y busca seguir creciendo para competir al más alto nivel.",
  },
  en: {
    edad: "Age", categoria: "Category", cadete: "Cadet", disciplina: "Discipline",
    rutaMonte: "Road / TT / MTB", historico: "My story", equipoTitulo: "My setup",
    equipoHeadline: "Bikes and build", materialTitulo: "Gear", verMas: "See more",
    cerrar: "Close", fotoAnio: "Photo of the year", fotoBici: "Bike photo",
    // Traducción de la bio ES vigente (la EN del prototipo estaba desactualizada)
    bio: "Finding cycling was a journey. Saúl Vargas, 14, went through several sports before finding his passion in cycling, and none of those years was wasted time: each one left him tools he now uses on the bike. He races road and mountain, trains consistently, and keeps growing so he can compete at the highest level.",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Spec = { label: string; value: string };
export type Bike = { id: string; disciplina: string; nombre: string; foto?: string; specs: Spec[] };

export const EQUIPO: Record<Locale, { bikes: Bike[]; gear: Spec[] }> = {
  es: {
    bikes: [
      { id: "bike-ruta", disciplina: "Ruta", nombre: "Specialized Tarmac SL7", specs: [
        { label: "Cuadro", value: "Carbono, talla S" },
        { label: "Grupo", value: "Shimano 105, 2x11v" },
        { label: "Ruedas", value: "Perfil medio, cubierta 700x25" },
        { label: "Potencia / manillar", value: "90 mm / 38 cm" },
        { label: "Pedales", value: "Automáticos de ruta" },
      ] },
      { id: "bike-mtb", disciplina: "Montaña", nombre: "Cube AMS", specs: [
        { label: "Cuadro", value: 'Rígida 29", talla S' },
        { label: "Horquilla", value: "Suspensión 100 mm con bloqueo" },
        { label: "Grupo", value: "1x12v" },
        { label: "Neumáticos", value: "29x2.25 XC" },
        { label: "Frenos", value: "Disco hidráulico" },
      ] },
    ],
    gear: [
      { label: "Casco", value: "Casco de ruta certificado" },
      { label: "Gafas", value: "Lente fotocromática" },
      { label: "Zapatillas", value: "Suela de carbono" },
      { label: "Ciclocomputador", value: "GPS con potenciómetro" },
    ],
  },
  en: {
    bikes: [
      { id: "bike-ruta", disciplina: "Road", nombre: "Specialized Tarmac SL7", specs: [
        { label: "Frame", value: "Carbon, size S" },
        { label: "Groupset", value: "Shimano 105, 2x11s" },
        { label: "Wheels", value: "Mid-profile, 700x25 clincher" },
        { label: "Stem / bar", value: "90 mm / 38 cm" },
        { label: "Pedals", value: "Road clipless" },
      ] },
      { id: "bike-mtb", disciplina: "Mountain", nombre: "Cube AMS", specs: [
        { label: "Frame", value: '29" hardtail, size S' },
        { label: "Fork", value: "100 mm travel with lockout" },
        { label: "Groupset", value: "1x12s" },
        { label: "Tires", value: "29x2.25 XC" },
        { label: "Brakes", value: "Hydraulic disc" },
      ] },
    ],
    gear: [
      { label: "Helmet", value: "Certified road helmet" },
      { label: "Eyewear", value: "Photochromic lens" },
      { label: "Shoes", value: "Carbon sole" },
      { label: "Computer", value: "GPS with power meter" },
    ],
  },
};
