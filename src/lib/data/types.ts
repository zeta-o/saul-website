// Filas de la base (tablas en supabase/migrations).

export type Disciplina = "ruta" | "montana";

export type GalleryRow = {
  id: string;
  disciplina: Disciplina;
  image_path: string | null;
  descripcion_es: string;
  descripcion_en: string;
  fotografo_handle: string;
  fotografo_url: string;
  orden: number;
  publicado: boolean;
};

export type HistoryYearRow = {
  id?: string;
  label_es: string;
  label_en: string;
  titulo_es: string;
  titulo_en: string;
  cuerpo_es: string;
  cuerpo_en: string;
  cierre_es: string;
  cierre_en: string;
  logros_es: string[];
  logros_en: string[];
  video_path: string | null;
  fotos: string[];
  orden: number;
  inicial: boolean;
  publicado?: boolean;
};

export type PostEstado = "borrador" | "publicado";

export type BlogPostRow = {
  id: string;
  slug: string;
  titulo_es: string;
  titulo_en: string;
  resumen_es: string;
  resumen_en: string;
  cuerpo_es: string;
  cuerpo_en: string;
  portada_path: string | null;
  estado: PostEstado;
  publicado_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MeasurementRow = {
  id: string;
  fecha: string;
  peso_kg: number | null;
  altura_m: number | null;
  ftp_w: number | null;
  vo2max: number | null;
  p5s_w: number | null;
  p1m_w: number | null;
  p5m_w: number | null;
  p20m_w: number | null;
  horas_semana: number | null;
  km_semana: number | null;
  desnivel_semana_m: number | null;
  carreras_temporada: number | null;
  notas: string;
};

export type SolicitudEstado = "pendiente" | "aprobada" | "rechazada";

export type AccessRequestRow = {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  social_url: string;
  acepta_actualizaciones: boolean;
  estado: SolicitudEstado;
  notas: string;
  created_at: string;
  decidido_at: string | null;
};

export type AllowedEmailRow = {
  email: string;
  nombre: string;
  acepta_actualizaciones: boolean;
  request_id: string | null;
  created_at: string;
};
