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
| `/{es,en}/estadisticas` | Acceso restringido. Con sesión y acceso: últimos valores y gráficas de `measurements` (W o W/kg). Sin acceso: iniciar sesión o solicitar acceso |
| `/{es,en}/contacto` | Contacto (no está en el menú, igual que en el diseño) |
| `/admin` | Admin privado (no enlazado desde el sitio) |

`src/proxy.ts` redirige `/` y rutas sin idioma según la cookie `NEXT_LOCALE` o, en la primera
visita, el header `Accept-Language`. En `/admin` y `/{es,en}/estadisticas` refresca la sesión de Supabase.

## Admin (`/admin`)

Se entra con **código de 6 dígitos por correo** (Supabase Auth, OTP). Solo reciben correo las
direcciones de la tabla `admins`; la respuesta es la misma para cualquier correo. Si el correo trae
un **enlace** en vez del código (plantilla por defecto de Supabase, ver abajo), el enlace lleva a
`/admin/confirmar`, que abre la sesión; hay que abrirlo en el mismo navegador donde se pidió.

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

## Estadísticas para entrenadores

1. La persona pide acceso en `/estadisticas` → queda en **Admin → Accesos** como pendiente.
2. Al aprobarla (o con "Dar acceso"), su correo entra a `allowed_emails`.
3. En `/estadisticas` → "Iniciar sesión" recibe un código (o un enlace, con el correo por defecto de
   Supabase) y ve los números. Los admins entran igual, sin pedir acceso.
4. Al revocar el acceso, la próxima visita vuelve a mostrar el candado.

Las notas de cada medición no se muestran en la página (solo en el admin), pero RLS da la fila completa
a quien tiene acceso: no escribir en ellas nada que un entrenador no deba leer.

## Supabase

- `supabase/migrations/…_admin.sql`: tablas, RLS, funciones `is_admin()` / `is_admin_email()` y bucket
  público `media` (fotos y videos; solo admins suben o borran).
- `supabase/migrations/…_contenido_inicial.sql`: carga la historia y la galería actuales si las tablas
  están vacías. Se regenera desde `src/content` con `npm run db:semilla`.
- `supabase/migrations/…_permisos.sql`: permisos de tabla para `anon` / `authenticated`. Los proyectos
  nuevos de Supabase no los dan solos; sin ellos el sitio cae al contenido estático y el admin no guarda.
- `supabase/templates/codigo.html`: correo con el código (`{{ .Token }}`).

Lectura pública: galería, historia y posts publicados. Mediciones: admin y correos de `allowed_emails`
(`is_allowed()`, migración `…_estadisticas.sql`). Solicitudes y accesos: solo admin.
Cualquiera puede **crear** una solicitud (estado `pendiente`), nadie puede leerlas sin ser admin.

### Producción

Proyecto `mklizgshxdmenerfummd` (us-east-1), ya configurado:

- Migraciones aplicadas (también registradas en `supabase_migrations`, así que `npx supabase db push`
  solo aplica las nuevas).
- Auth: código de 6 dígitos, vence en 600 s; Site URL `https://saulvargas.bike`; redirecciones
  permitidas `https://saulvargas.bike/**`, `https://www.saulvargas.bike/**` y `http://localhost:3000/**`.
- Admin: `insert into public.admins (email) values ('correo@dominio.com');` en el SQL Editor.

Falta por hacer fuera del repo:

1. En Vercel → Settings → Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API) y `NEXT_PUBLIC_SITE_URL=https://saulvargas.bike`.
   Volver a desplegar.
2. Recomendado: SMTP propio (p. ej. Resend) en Authentication → Emails. En el plan gratis, con el
   correo incluido, Supabase **no deja cambiar la plantilla** (llega un enlace en lugar del código) y
   envía muy pocos correos por hora. Con SMTP, pegar `supabase/templates/codigo.html` en
   Email Templates → **Magic Link** y **Confirm signup** (asunto: "Tu código de acceso · Saúl Vargas").

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

- Página pública del blog.
- Aviso por correo al admin cuando llega una solicitud, y a quienes aceptan actualizaciones.
- Contenido: fotos reales, fotógrafos, fotos de bicicletas (`EQUIPO`), URLs de redes (`src/content/social.ts`).
