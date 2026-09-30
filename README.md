# Saúl Vargas — sitio web

Sitio personal bilingüe (ES/EN) de Saúl Vargas, ciclista cadete (ruta, TT y MTB, Costa Rica).
Implementa el handoff de Claude Design (`Saul Ciclista Web v13` + páginas internas) y un admin privado.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · shadcn/ui (Radix) · Zustand · Supabase · Vercel.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000 → redirige a /es o /en
npm run build
npm run lint
```

Sin variables de Supabase el sitio funciona igual con el contenido estático de `src/content`
(y `/admin` muestra un aviso). Para trabajar con la base local:

```bash
npm run db:start          # Supabase local (Docker). Imprime URL y anon key
cp .env.example .env.local   # pegar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run db:reset          # aplica migraciones + supabase/seed.sql (admin local: admin@saul.local)
```

En local los correos (códigos de acceso) llegan a Mailpit: http://127.0.0.1:54324

## Rutas

| Ruta | Página |
| --- | --- |
| `/{es,en}` | Inicio (hero) |
| `/{es,en}/sobre-mi` | Bio, "Mi equipo" (modal), línea de tiempo "Mi historia" (desde la base) |
| `/{es,en}/galeria` | Galería filtrable Todas / Ruta / Montaña (desde la base) |
| `/{es,en}/estadisticas` | Acceso restringido. "Solicitar acceso" guarda la solicitud; el login aún es simulado |
| `/{es,en}/contacto` | Contacto (no está en el menú, igual que en el diseño) |
| `/admin` | Admin privado (no enlazado desde el sitio) |

`src/proxy.ts` redirige `/` y rutas sin idioma según la cookie `NEXT_LOCALE` o, en la primera
visita, el header `Accept-Language`. En `/admin` solo refresca la sesión de Supabase.

## Admin (`/admin`)

Se entra con **código de 6 dígitos por correo** (Supabase Auth, OTP). Solo reciben código los
correos de la tabla `admins`; la respuesta es la misma para cualquier correo.

| Sección | Qué hace |
| --- | --- |
| Resumen | Solicitudes pendientes, fotos, años, entradas y la última medición |
| Galería | Subir fotos (ruta / montaña), descripción ES/EN, crédito del fotógrafo con enlace, ordenar, ocultar |
| Mi historia | Crear, editar, ordenar y ocultar años de la línea de tiempo: texto ES/EN, logros, frase de cierre, 3 fotos o video, año inicial |
| Blog | Entradas en borrador o publicadas (ES/EN, portada). La página pública del blog sigue oculta |
| Números | Mediciones por fecha (peso, FTP, VO₂, potencias 5 s–20 min, carga semanal) con dashboard e historial; W o W/kg |
| Accesos | Solicitudes del formulario público: aprobar / rechazar / reabrir; lista de correos con acceso; dar o revocar acceso |

Formato de los textos largos (historia y blog): una línea en blanco separa párrafos y una línea
que empieza con `## ` es un subtítulo.

Al guardar galería o historia, las páginas públicas se actualizan al instante (`updateTag` sobre
las etiquetas de caché `galeria` / `historia`); siguen siendo páginas estáticas.

## Supabase

- `supabase/migrations/…_admin.sql`: tablas, RLS, funciones `is_admin()` / `is_admin_email()` y bucket
  público `media` (fotos y videos; solo admins suben o borran).
- `supabase/migrations/…_contenido_inicial.sql`: carga la historia y la galería actuales si las tablas
  están vacías. Se regenera desde `src/content` con `npm run db:semilla`.
- `supabase/templates/codigo.html`: correo con el código (`{{ .Token }}`).

Lectura pública: galería, historia y posts publicados. Mediciones, solicitudes y accesos: solo admin.
Cualquiera puede **crear** una solicitud (estado `pendiente`), nadie puede leerlas sin ser admin.

### Puesta en producción

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratis).
2. Aplicar las migraciones: `npx supabase login`, `npx supabase link --project-ref <ref>` y
   `npx supabase db push` (o pegar los dos archivos de `supabase/migrations` en el SQL Editor, en orden).
3. Dar de alta el/los admin: en el SQL Editor,
   `insert into public.admins (email) values ('correo@dominio.com');`
4. Authentication → Email Templates: en **Magic Link** y **Confirm signup** pegar el HTML de
   `supabase/templates/codigo.html` (asunto: "Tu código de acceso · Saúl Vargas").
   Authentication → Providers → Email: longitud del código 6 y vencimiento 600 s.
5. Recomendado: Authentication → Emails → SMTP propio (p. ej. Resend). El correo incluido en
   Supabase envía muy pocos mensajes por hora.
6. En Vercel → Settings → Environment Variables: `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API). Volver a desplegar.

## Estructura

```
src/
  app/[lang]/…          páginas públicas (SSG)
  app/admin/…           admin: login y (panel)/… con server actions por sección
  components/ui/        componentes shadcn/ui
  components/site/      header, menú móvil, redes, selector de idioma, tabs, PhotoSlot
  components/admin/     UI del admin (formularios, subida de archivos, dashboard de números)
  content/              copy fijo (ES/EN) y respaldo estático de historia y galería
  lib/data/             lecturas públicas (Supabase con respaldo estático) y tipos de la base
  lib/supabase/         clientes (público con caché, servidor con sesión, navegador) y proxy
  lib/admin/            requireAdmin(), helpers de server actions
  stores/               estado de UI con Zustand
supabase/               config local, migraciones, plantilla de correo, seed local
```

## Pendiente

- Página de estadísticas para entrenadores con acceso (login real contra `allowed_emails` y
  lectura de `measurements` con RLS). Hoy el login de `/estadisticas` es simulado.
- Página pública del blog.
- Aviso por correo al admin cuando llega una solicitud, y a quienes aceptan actualizaciones.
- Contenido: fotos reales, fotógrafos, fotos de bicicletas (`EQUIPO`), URLs de redes (`src/content/social.ts`).
