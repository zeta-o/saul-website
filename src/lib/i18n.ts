export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Rutas del sitio (sin prefijo de idioma). */
export const routes = {
  inicio: "",
  sobreMi: "/sobre-mi",
  galeria: "/galeria",
  stats: "/estadisticas",
  contacto: "/contacto",
} as const;

export const href = (lang: Locale, path: string) => `/${lang}${path}`;

/** Cambia el prefijo de idioma de una ruta, conservando el resto. */
export function switchLocalePath(pathname: string, lang: Locale) {
  const parts = pathname.split("/");
  if (parts.length > 1 && hasLocale(parts[1])) parts[1] = lang;
  else parts.splice(1, 0, lang);
  return parts.join("/") || `/${lang}`;
}

export const nav = {
  es: { inicio: "Inicio", sobreMi: "Sobre mí", galeria: "Galería", stats: "Mis estadísticas", contacto: "Contacto", menu: "Menú" },
  en: { inicio: "Home", sobreMi: "About", galeria: "Gallery", stats: "My stats", contacto: "Contact", menu: "Menu" },
} satisfies Record<Locale, Record<string, string>>;

export const TAGLINE = "Sin Miedo · Sin Atajos · Sin Excusas";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
