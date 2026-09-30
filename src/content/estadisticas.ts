import type { Locale } from "@/lib/i18n";

export const statsCopy = {
  es: {
    privado: "Acceso restringido", bloqueado: "Contenido bloqueado", accesoOk: "Acceso concedido",
    gateTexto: "Estos números no son públicos. Están pensados para entrenadores, equipos y gente del medio. Déjame tus datos y te doy acceso.",
    correoLabel: "Correo", rolLabel: "Equipo o rol (entrenador, director, patrocinador)",
    login: "Iniciar sesión", entrar: "Entrar", claveLabel: "Código de acceso",
    codigoNota: "Si tu correo tiene acceso, te enviamos un código de 6 dígitos o un enlace (revisa también spam). Escribe el código o abre el enlace en este mismo navegador. Vence en 10 minutos.",
    loginNota: "Si ya se te ha brindado acceso antes, no es necesario solicitarlo de nuevo: escribe tu correo y te enviamos un código.",
    enviarCodigo: "Recibir código", errorCodigo: "Código incorrecto o vencido.", enviandoCodigo: "Enviando…", verificando: "Verificando…",
    otroCorreo: "Usar otro correo",
    errorEnlace: "El enlace no es válido o venció. Pide un código nuevo.",
    errorSinAcceso: "Este correo no tiene acceso. Puedes solicitarlo en la otra pestaña.",
    errorLimite: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
    sesion: "Sesión iniciada como", salir: "Cerrar sesión",
    sinDatos: "Todavía no hay mediciones publicadas. Vuelve pronto.",
    alDia: "Al", evolucion: "Evolución", unidad: "Unidad de potencia", unidadW: "Vatios (W)", unidadWkg: "Relativo (W/kg)",
    ftp: "FTP", potencia: "Potencia máxima", peso: "Peso (kg)", volumen: "Volumen semanal (h)",
    perfil: "Perfil", carga: "Carga de entrenamiento",
    nombreReq: "Nombre *", correoReq: "Correo *", socialLabel: "URL de red social",
    updatesLabel: "Desea recibir actualizaciones del perfil",
    updatesNota: "Esta información no se usará para spam ni para suscribirte a un blog. Es solo para notificarte, a modo de seguimiento, cuando haya alguna actualización de datos.",
    enviado: "Solicitud enviada. Te escribiremos al correo indicado.",
    errorNombre: "Escribe tu nombre para continuar.",
    errorServidor: "No pudimos enviar la solicitud. Inténtalo de nuevo en unos minutos.",
    enviando: "Enviando…",
    solicitar: "Solicitar acceso", errorCorreo: "Escribe un correo válido para continuar.",
    disclaimer: "Datos de la temporada en curso, medidos con potenciómetro y actualizados periódicamente.",
  },
  en: {
    privado: "Restricted access", bloqueado: "Locked content", accesoOk: "Access granted",
    gateTexto: "These numbers are not public. They are meant for coaches, teams, and people in the sport. Leave your details and I will grant access.",
    correoLabel: "Email", rolLabel: "Team or role (coach, director, sponsor)",
    login: "Log in", entrar: "Enter", claveLabel: "Access code",
    codigoNota: "If your email has access, we sent you a 6-digit code or a link (check spam too). Enter the code or open the link in this same browser. It expires in 10 minutes.",
    loginNota: "If you have been given access before, there is no need to request it again: enter your email and we will send you a code.",
    enviarCodigo: "Get code", errorCodigo: "Wrong or expired code.", enviandoCodigo: "Sending…", verificando: "Verifying…",
    otroCorreo: "Use another email",
    errorEnlace: "The link is invalid or has expired. Request a new code.",
    errorSinAcceso: "This email does not have access. You can request it in the other tab.",
    errorLimite: "Too many attempts. Wait a few minutes and try again.",
    sesion: "Signed in as", salir: "Sign out",
    sinDatos: "No measurements published yet. Check back soon.",
    alDia: "As of", evolucion: "Progress", unidad: "Power unit", unidadW: "Watts (W)", unidadWkg: "Relative (W/kg)",
    ftp: "FTP", potencia: "Peak power", peso: "Weight (kg)", volumen: "Weekly volume (h)",
    perfil: "Profile", carga: "Training load",
    nombreReq: "Name *", correoReq: "Email *", socialLabel: "Social media URL",
    updatesLabel: "I want to receive profile updates",
    updatesNota: "This information will not be used for spam or to subscribe you to a blog. It is only to notify you, as follow-up, when there is a data update.",
    enviado: "Request sent. We will write to the email you provided.",
    errorNombre: "Enter your name to continue.",
    errorServidor: "We couldn't send your request. Please try again in a few minutes.",
    enviando: "Sending…",
    solicitar: "Request access", errorCorreo: "Enter a valid email to continue.",
    disclaimer: "Current-season data, measured with a power meter and updated regularly.",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Metric = { label: string; value: string; nota: string };
export type MetricGroup = { titulo: string; metrics: Metric[] };

// Valores de ejemplo: solo se ven borrosos detrás del candado. Los reales vienen de measurements.
export const STATS: Record<Locale, MetricGroup[]> = {
  es: [
    { titulo: "Perfil", metrics: [
      { label: "Peso", value: "52 kg", nota: "Temporada 2026" },
      { label: "Altura", value: "1,68 m", nota: "" },
      { label: "FTP", value: "265 W", nota: "5,1 W/kg" },
      { label: "VO₂ máx", value: "68", nota: "ml/kg/min (estimado)" },
    ] },
    { titulo: "Potencia máxima", metrics: [
      { label: "5 segundos", value: "890 W", nota: "17,1 W/kg" },
      { label: "1 minuto", value: "470 W", nota: "9,0 W/kg" },
      { label: "5 minutos", value: "330 W", nota: "6,3 W/kg" },
      { label: "20 minutos", value: "279 W", nota: "5,4 W/kg" },
    ] },
    { titulo: "Carga de entrenamiento", metrics: [
      { label: "Volumen semanal", value: "12 h", nota: "Promedio temporada" },
      { label: "Kilómetros / semana", value: "320 km", nota: "Ruta y MTB" },
      { label: "Desnivel / semana", value: "4.800 m", nota: "" },
      { label: "Carreras 2026", value: "18", nota: "Ruta y MTB" },
    ] },
  ],
  en: [
    { titulo: "Profile", metrics: [
      { label: "Weight", value: "52 kg", nota: "2026 season" },
      { label: "Height", value: "1.68 m", nota: "" },
      { label: "FTP", value: "265 W", nota: "5.1 W/kg" },
      { label: "VO₂ max", value: "68", nota: "ml/kg/min (estimated)" },
    ] },
    { titulo: "Peak power", metrics: [
      { label: "5 seconds", value: "890 W", nota: "17.1 W/kg" },
      { label: "1 minute", value: "470 W", nota: "9.0 W/kg" },
      { label: "5 minutes", value: "330 W", nota: "6.3 W/kg" },
      { label: "20 minutes", value: "279 W", nota: "5.4 W/kg" },
    ] },
    { titulo: "Training load", metrics: [
      { label: "Weekly volume", value: "12 h", nota: "Season average" },
      { label: "Km / week", value: "320 km", nota: "Road and MTB" },
      { label: "Elevation / week", value: "4,800 m", nota: "" },
      { label: "2026 races", value: "18", nota: "Road and MTB" },
    ] },
  ],
};
