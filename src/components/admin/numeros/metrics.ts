import type { MeasurementRow } from "@/lib/data/types";

export type MetricKey = Exclude<keyof MeasurementRow, "id" | "fecha" | "notas">;

/** Métricas en el orden del prototipo de Estadísticas. */
export const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  step: string;
  /** Si subir es bueno (colorea el cambio). null = neutral. */
  upIsGood: boolean | null;
  /** Se puede expresar en W/kg. */
  power?: boolean;
  grupo: "Perfil" | "Potencia máxima" | "Carga de entrenamiento";
}[] = [
  { key: "peso_kg", label: "Peso", unit: "kg", step: "0.1", upIsGood: null, grupo: "Perfil" },
  { key: "altura_m", label: "Altura", unit: "m", step: "0.01", upIsGood: null, grupo: "Perfil" },
  { key: "ftp_w", label: "FTP", unit: "W", step: "1", upIsGood: true, power: true, grupo: "Perfil" },
  { key: "vo2max", label: "VO₂ máx", unit: "ml/kg/min", step: "0.1", upIsGood: true, grupo: "Perfil" },
  { key: "p5s_w", label: "5 segundos", unit: "W", step: "1", upIsGood: true, power: true, grupo: "Potencia máxima" },
  { key: "p1m_w", label: "1 minuto", unit: "W", step: "1", upIsGood: true, power: true, grupo: "Potencia máxima" },
  { key: "p5m_w", label: "5 minutos", unit: "W", step: "1", upIsGood: true, power: true, grupo: "Potencia máxima" },
  { key: "p20m_w", label: "20 minutos", unit: "W", step: "1", upIsGood: true, power: true, grupo: "Potencia máxima" },
  { key: "horas_semana", label: "Volumen semanal", unit: "h", step: "0.5", upIsGood: null, grupo: "Carga de entrenamiento" },
  { key: "km_semana", label: "Kilómetros / semana", unit: "km", step: "1", upIsGood: null, grupo: "Carga de entrenamiento" },
  { key: "desnivel_semana_m", label: "Desnivel / semana", unit: "m", step: "10", upIsGood: null, grupo: "Carga de entrenamiento" },
  { key: "carreras_temporada", label: "Carreras en la temporada", unit: "", step: "1", upIsGood: null, grupo: "Carga de entrenamiento" },
];

/** Número con formato de Costa Rica ("4.800", "5,1"), igual en servidor y navegador. */
export function nf(v: number, max = 1) {
  const [ent, dec] = Number(v.toFixed(max)).toString().split(".");
  const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${miles},${dec}` : miles;
}

/** Peso vigente en cada fecha (el último conocido), para expresar potencia en W/kg. */
export function pesoVigente(rows: MeasurementRow[]) {
  let peso: number | null = null;
  return rows.map((r) => (peso = r.peso_kg ?? peso));
}
