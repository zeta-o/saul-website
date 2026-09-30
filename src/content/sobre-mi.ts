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

export type HistoryEntry = {
  /** Identificador estable (no cambia con el idioma). */
  id: "ninez" | "2024" | "2025" | "2026" | "2027";
  year: string;
  titulo: string;
  parrafos: string[];
  subtitulo?: string;
  parrafos2?: string[];
  subtitulo3?: string;
  parrafos3?: string[];
  cierre?: string;
  logros: string[];
  /** Niñez muestra video en lugar de la foto grande. */
  video?: string;
};

export const DEFAULT_YEAR: HistoryEntry["id"] = "2024";

export const HISTORY: Record<Locale, HistoryEntry[]> = {
  es: [
    { id: "ninez", year: "Niñez", video: "/video/ninez-video.mp4", titulo: "Antes de la bicicleta", parrafos: ["Desde niño, Saúl sintió una atracción especial por las bicicletas. Le llamaban la atención antes de entender por qué, mucho antes de pensar en competir.", "No entró a un proceso formativo temprano. Lo que hubo fue un recorrido amplio y amateur: patinaje, skimboard, balance board, jiu-jitsu brasileño, taekwondo y fútbol. Deportes distintos entre sí, elegidos sin un plan detrás, pero con un hilo en común: todos le pedían equilibrio, velocidad y coordinación.", "El patinaje y las tablas le enseñaron a sostenerse en movimiento y a confiar en su propio centro de gravedad. Las artes marciales le dieron disciplina, constancia y la costumbre de repetir un gesto hasta que sale solo. El fútbol le enseñó a leer el juego y a competir en equipo.", "Nada de eso fue entrenamiento para el ciclismo. Pero cuando finalmente se subió en serio a la bicicleta, muchas cosas ya estaban ahí. La coordinación, el equilibrio, la toma de decisiones, leer el pelotón y todo su campo alrededor y sobre todo disciplina y coraje. Formaron al deportista que se decantó que es hoy, el que vió en el ciclismo su amor y pasión."], logros: [] },
    { id: "2024", year: "2024", titulo: "Tenis: la primera escuela", parrafos: ["Desde mediados de 2023 y hasta finales de 2024 practicó tenis, el primer deporte que explora a fondo: año y medio de entrenamiento con estructura, objetivos y calendario de competencia. En ese corto tiempo clasificó a Juegos Nacionales y consiguió medalla de plata en dobles. Al cerrar 2024 decide empezar un proceso en triatlón.", "El tenis le mostró de qué se trata competir en serio: preparar una temporada, sostener el nivel bajo presión, entender que el resultado se construye mucho antes del día de la prueba. Esa fue la escuela que se llevó a la bicicleta."], logros: ["Clasificación a Juegos Nacionales", "Medalla de plata en dobles"] },
    { id: "2025", year: "2025", titulo: "Triatlón: la primera temporada exigente", parrafos: ["2025 fue el primer año de Saúl con una carga real de entrenamiento y competencia. El triatlón le exigió algo que ningún deporte anterior le había pedido: sostener tres disciplinas a la vez, organizar la semana alrededor del entrenamiento y llegar en forma a fechas puntuales del calendario.", "Compitió en las pruebas más importantes del país y cerró la temporada quinto en el ranking nacional de la categoría Youth, en un grupo donde la mayoría de sus rivales le llevaba un año de edad y de desarrollo. Al pasar esos competidores a la categoría siguiente, Saúl abrió 2026 como número uno del ranking.", "La confirmación llegó en febrero de 2026. En las pruebas establecidas por FEUTRI, ente rector del triatlón en Costa Rica, Saúl alcanzó todas las marcas A para su edad y categoría. A diferencia de una posición en el ranking, las marcas no dependen de quién compite ese día: son un estándar fijo, y él lo cumplió completo."], subtitulo: "La primera carrera en bicicleta", parrafos2: ["Ese mismo año corrió su primera competencia formal de ciclismo: el Campeonato Nacional Infantil de Ciclismo de Ruta. Llegó sin una temporada de ruta detrás, con la preparación que le daba el triatlón y poco más. Terminó tercero en la contrarreloj y cuarto en la prueba de ruta."], logros: ["5.º del ranking nacional Youth de triatlón", "Todas las marcas A de FEUTRI para su categoría", "3.º en contrarreloj y 4.º en ruta, Campeonato Nacional Infantil de Ciclismo de Ruta"] },
    { id: "2026", year: "2026", titulo: "El salto al ciclismo", parrafos: ["El año arrancó todavía en triatlón: a inicios de 2026 Saúl completó las pruebas nacionales y cumplió a cabalidad con lo que exigían. Pero en marzo tomó una decisión y la tomó completa — dedicarse de lleno al ciclismo.", "Tenía dos objetivos en el calendario, ambos en mayo: el Campeonato Nacional y la Vuelta Juvenil. En el Campeonato terminó en el puesto 12, llegando en el grupo del ganador. En la Vuelta, puesto 20 entre 63 corredores. Sin el tiempo de preparación que idealmente pide una temporada, cumplió el primer objetivo que se había puesto."], subtitulo: "Critériums", parrafos2: ["El resto del año ha competido en diferentes critériums, y ahí la progresión se ve con claridad: octavo en Palmares, sexto en San Isidro, sexto en Santo Domingo y quinto en Cartago. Puntuó en la mayoría de ellas.", "La curva va en la dirección que buscaba. Cada objetivo del año ha tenido la evolución esperada hacia el ciclista que Saúl quiere ser: un rodador potente y rápido."], subtitulo3: "MTB — Formación en la montaña", parrafos3: ["En julio de 2026 Saúl sumó entrenamientos de montaña. No es su objetivo central, pero sí una parte integral de su formación: el MTB enseña algo que la ruta no enseña igual — coraje, determinación y la capacidad de resolver terreno difícil sin perder la cabeza.", "Sus resultados en las dos fechas del XCO han sido discretos en la tabla, pero hablan de lo que importa. En la primera, salió desde el puesto 34 y terminó 13. En la segunda, arrancó 23 y cerró 16. En ambas avanzó posiciones durante la carrera.", "La montaña seguirá siendo un complemento. La ruta es el objetivo principal a la fecha, y el MTB está ahí para hacerlo mejor ciclista mientras tanto.", "Así lo que queda para este 2026 es cerrar la última fecha del campeonato de XCO y el campeonato nacional de Criterium. Para así empezar la pre temporada para entrar al 2027 esta vez ya preparado y competir."], logros: ["12.º en el Campeonato Nacional de Ruta", "20.º de 63 en la Vuelta Juvenil", "Critériums: 8.º Palmares, 6.º San Isidro, 6.º Santo Domingo, 5.º Cartago", "XCO: del 34 al 13 y del 23 al 16"] },
    { id: "2027", year: "2027", titulo: "Lo que viene", parrafos: ["2026 ha sido, sobre todo, un año de aprendizaje: aprender a competir en ciclismo, a leer una carrera, a manejar un calendario y a entender dónde está como competidor. Todo eso se convierte ahora en objetivos para 2027, competir en una una categoría muy exigente y con grande y talentosos rivales en el país.", "Sea lo que venga, estamos preparandonos de la mejor manera para afrontar los retos que nos traíga el 2027. Vamos con todo."], cierre: "Sin Miedo · Sin Atajos · Sin Excusas", logros: [] },
  ],
  en: [
    { id: "ninez", year: "Niñez", video: "/video/ninez-video.mp4", titulo: "Before the bike", parrafos: ["Saúl was drawn to bikes from an early age, long before he understood why and long before he thought about racing.", "There was no early formal pathway. Instead there was a wide, amateur run through sports: skating, skimboard, balance board, Brazilian jiu-jitsu, taekwondo, and football. Very different sports, chosen without a plan, but with one thread in common: all of them asked for balance, speed, and coordination.", "Skating and the boards taught him to hold himself in motion and trust his own center of gravity. The martial arts gave him discipline, consistency, and the habit of repeating a movement until it comes out on its own. Football taught him to read the game and to compete as part of a team.", "None of it was cycling training. But by the time he got seriously on the bike, those three things were already there. They are the same ones that hold up the way he rides today."], logros: [] },
    { id: "2024", year: "2024", titulo: "Tennis: the first school", parrafos: ["From mid-2023 through the end of 2024 he played tennis, the first sport he explored in depth: a year and a half of structured training, with goals and a competition calendar. In that short time he qualified for the National Games and took a silver medal in doubles. At the close of 2024 he decided to start a process in triathlon.", "Tennis showed him what competing seriously means: preparing a season, holding your level under pressure, understanding that the result is built long before race day. That was the schooling he carried over to the bike."], logros: ["Qualified for the National Games", "Silver medal in doubles"] },
    { id: "2025", year: "2025", titulo: "Triathlon: the first demanding season", parrafos: ["2025 was Saúl’s first year with a real training and racing load. Triathlon asked something no previous sport had: holding three disciplines at once, organizing the week around training, and arriving in form on specific calendar dates.", "He raced the country’s most important events and closed the season fifth in the national Youth ranking, in a field where most of his rivals were a year older and further developed. When those competitors moved up a category, Saúl opened 2026 as the number one in the ranking.", "Confirmation came in February 2026. In the tests set by FEUTRI, the governing body of triathlon in Costa Rica, Saúl hit every A standard for his age and category. Unlike a ranking position, the standards do not depend on who shows up that day: they are a fixed benchmark, and he met all of them."], subtitulo: "The first bike race", parrafos2: ["That same year he rode his first formal cycling competition: the National Youth Championship. He arrived without a road season behind him, with the preparation triathlon gave him and little else. He finished third in the time trial and fourth in the road race."], logros: ["5th in the national Youth triathlon ranking", "All FEUTRI A standards for his category", "3rd in the TT and 4th on the road, National Youth Championship"] },
    { id: "2026", year: "2026", titulo: "The jump to cycling", parrafos: ["The year still started in triathlon: in early 2026 Saúl completed the national tests and met everything they asked of him. But in March he made a decision and made it fully — to commit entirely to cycling.", "He had two goals on the calendar, both in May: the National Championship and the Vuelta Juvenil. At the Championship he finished 12th, arriving in the winner’s group. At the Vuelta, 20th out of 63 riders. Without the preparation time a season ideally asks for, he met the first goal he had set himself."], subtitulo: "Criteriums", parrafos2: ["He has raced the rest of the year in criteriums, and the progression is clear there: eighth in Palmares, sixth in San Isidro, sixth in Santo Domingo, and fifth in Cartago. He scored points in most of them.", "The curve is heading in the direction he was after. Every goal of the year has shown the expected evolution toward the rider Saúl wants to be: a powerful, fast rouleur."], subtitulo3: "MTB — Schooling in the mountains", parrafos3: ["In July 2026 Saúl added mountain training. It is not his central goal, but it is an integral part of his development: MTB teaches something the road does not teach the same way — courage, determination, and the ability to solve difficult terrain without losing your head.", "His results in the two XCO rounds have been modest on the table, but they say what matters. In the first, he started 34th and finished 13th. In the second, he started 23rd and closed 16th. In both he moved up positions during the race.", "The mountain will stay a complement. The road is the main goal to date, and MTB is there to make him a better rider in the meantime.", "So what remains for 2026 is to close the last XCO round and the national Criterium championship. And from there, start the pre-season to enter 2027 prepared, and race."], logros: ["12th at the National Road Championship", "20th of 63 at the Vuelta Juvenil", "Criteriums: 8th Palmares, 6th San Isidro, 6th Santo Domingo, 5th Cartago", "XCO: 34th to 13th, and 23rd to 16th"] },
    { id: "2027", year: "2027", titulo: "What comes next", parrafos: ["2026 has been, above all, a year of learning: learning to race a bike, to read a race, to manage a calendar, and to understand where he stands as a competitor. All of that now turns into goals for 2027: racing in a very demanding category, against strong and highly talented rivals in the country.", "Whatever comes, we are preparing in the best way possible to take on what 2027 brings."], cierre: "Sin Miedo · Sin Atajos · Sin Excusas", logros: [] },
  ],
};

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
