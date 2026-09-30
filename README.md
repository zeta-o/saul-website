# Saúl Vargas — sitio web

Sitio personal bilingüe (ES/EN) de Saúl Vargas, ciclista cadete (ruta, TT y MTB, Costa Rica).
Implementa el handoff de Claude Design (`Saul Ciclista Web v13` + páginas internas).

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · shadcn/ui (Radix) · Zustand · listo para Vercel.
Supabase queda para la siguiente fase: **esta versión es 100 % estática** (todo el contenido vive en `src/content`).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000 → redirige a /es o /en
npm run build    # todas las páginas se prerenderizan (SSG)
npm run lint
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/{es,en}` | Inicio (hero) |
| `/{es,en}/sobre-mi` | Bio, "Mi equipo" (modal), línea de tiempo "Mi historia" |
| `/{es,en}/galeria` | Galería filtrable Todas / Ruta / Montaña |
| `/{es,en}/estadisticas` | Acceso restringido + estadísticas (flujo simulado) |
| `/{es,en}/contacto` | Contacto (no está en el menú, igual que en el diseño) |

`src/proxy.ts` redirige `/` y rutas sin idioma según la cookie `NEXT_LOCALE`
o, en la primera visita, el header `Accept-Language`. El selector ES/EN guarda la cookie.

## Estructura

```
src/
  app/[lang]/…          páginas (server components, SSG)
  components/ui/        componentes shadcn/ui (button, input, textarea, checkbox, dialog, sheet)
  components/site/      header, menú móvil, redes, selector de idioma, tabs, PhotoSlot
  components/…          secciones por página (client components)
  content/              TODO el copy y los datos (ES/EN) — editar aquí
  stores/               estado de UI con Zustand (año activo, modal, tab de galería, formulario de acceso)
  lib/                  i18n, fuentes, utils
public/images, public/video   assets del diseño
```

> shadcn/ui: los componentes están en `src/components/ui` con estilos del diseño
> (`components.json` incluido, así que `npx shadcn add …` funciona para añadir más).

## Desplegar en Vercel

1. Importar el repo en Vercel (framework: Next.js, sin configuración extra).
2. Opcional: `NEXT_PUBLIC_SITE_URL=https://tu-dominio` para URLs absolutas de Open Graph.

## Comportamiento estático actual (a reemplazar con Supabase)

- **Estadísticas:** el login con código y "Continuar con Google" solo simulan el acceso
  (cualquier código no vacío desbloquea, como en el prototipo). Los valores de `STATS` son de ejemplo.
  La solicitud de acceso valida y muestra el mensaje de éxito, pero no guarda nada.
- **Contacto:** valida y abre el cliente de correo (`mailto:`) con el mensaje.

### Próxima fase — Supabase

Según el README del handoff:
1. Tablas `allowed_emails`, `access_requests` (estado `pendiente`), `stats`, `gallery_items`
   (`{ disciplina, src, descripcion_es, descripcion_en, fotografo_handle, fotografo_url }` — ya es el
   tipo `GalleryItem` en `src/content/galeria.ts`).
2. Login OTP con Supabase Auth (`signInWithOtp` + `verifyOtp`, plantilla de correo con `{{ .Token }}`),
   solo para correos en `allowed_emails`, respondiendo siempre igual.
3. Google OAuth: al volver, permitir solo correos aprobados; si no, ofrecer "Solicitar acceso".
4. `stats` protegido por RLS; notificar por correo si `acepta_actualizaciones`.
5. Formulario de contacto → tabla + aviso por correo (p. ej. Resend).

## Pendientes de contenido

- Fotos reales y fotógrafos (handle + URL) en Galería y en la línea de tiempo.
- Fotos de las bicicletas (campo `foto` en `EQUIPO`).
- URLs reales de Instagram / Facebook / YouTube (`src/content/social.ts`).
- Estadísticas reales.
