-- Esquema del admin: galería, historia, blog, mediciones y control de accesos.
-- El contenido inicial (historia y galería actuales) está en la migración siguiente.

-- ─── Administradores ───────────────────────────────────────────────────────────
create table public.admins (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
comment on table public.admins is 'Correos que pueden entrar a /admin. Alta: insert into admins(email) values (''correo@dominio.com'');';

-- ¿La sesión actual es de un administrador?
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ¿Este correo es de un administrador? Se usa antes de enviar el código de acceso,
-- para no crear usuarios ni mandar correos a direcciones desconocidas.
create function public.is_admin_email(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where email = lower(trim(p_email)));
$$;

revoke all on function public.is_admin_email(text) from public;
grant execute on function public.is_admin_email(text) to anon, authenticated;

create policy "admins: lectura propia de admins" on public.admins
  for select to authenticated using (public.is_admin());

-- updated_at automático
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Galería ───────────────────────────────────────────────────────────────────
create type public.disciplina as enum ('ruta', 'montana');

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  disciplina public.disciplina not null,
  -- Ruta en el bucket "media" o ruta pública del sitio (/images/…). Null = marcador.
  image_path text,
  descripcion_es text not null,
  descripcion_en text not null default '',
  fotografo_handle text not null default '',
  fotografo_url text not null default '',
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gallery_items_orden_idx on public.gallery_items (disciplina, orden);
create trigger gallery_items_updated_at before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;
create policy "galeria: lectura pública" on public.gallery_items
  for select to anon, authenticated using (publicado or public.is_admin());
create policy "galeria: admin escribe" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Mi historia (línea de tiempo) ─────────────────────────────────────────────
-- cuerpo_*: párrafos separados por una línea en blanco; una línea que empieza
-- con "## " es un subtítulo.
create table public.history_years (
  id uuid primary key default gen_random_uuid(),
  label_es text not null,
  label_en text not null,
  titulo_es text not null default '',
  titulo_en text not null default '',
  cuerpo_es text not null default '',
  cuerpo_en text not null default '',
  cierre_es text not null default '',
  cierre_en text not null default '',
  logros_es text[] not null default '{}',
  logros_en text[] not null default '{}',
  video_path text,
  -- Hasta 3 fotos: la primera es la grande.
  fotos text[] not null default '{}' check (cardinality(fotos) <= 3),
  orden integer not null default 0,
  inicial boolean not null default false,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Solo un año puede ser el seleccionado al abrir la página.
create unique index history_years_un_inicial on public.history_years (inicial) where inicial;
create index history_years_orden_idx on public.history_years (orden);
create trigger history_years_updated_at before update on public.history_years
  for each row execute function public.set_updated_at();

alter table public.history_years enable row level security;
create policy "historia: lectura pública" on public.history_years
  for select to anon, authenticated using (publicado or public.is_admin());
create policy "historia: admin escribe" on public.history_years
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Blog ──────────────────────────────────────────────────────────────────────
create type public.post_estado as enum ('borrador', 'publicado');

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo_es text not null,
  titulo_en text not null default '',
  resumen_es text not null default '',
  resumen_en text not null default '',
  cuerpo_es text not null default '',
  cuerpo_en text not null default '',
  portada_path text,
  estado public.post_estado not null default 'borrador',
  publicado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;
create policy "blog: lectura pública de publicados" on public.blog_posts
  for select to anon, authenticated using (estado = 'publicado' or public.is_admin());
create policy "blog: admin escribe" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Mediciones (números de ciclismo) ──────────────────────────────────────────
create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  peso_kg numeric(5, 2) check (peso_kg > 0),
  altura_m numeric(4, 2) check (altura_m > 0),
  ftp_w integer check (ftp_w > 0),
  vo2max numeric(5, 1) check (vo2max > 0),
  p5s_w integer check (p5s_w > 0),
  p1m_w integer check (p1m_w > 0),
  p5m_w integer check (p5m_w > 0),
  p20m_w integer check (p20m_w > 0),
  horas_semana numeric(5, 1) check (horas_semana >= 0),
  km_semana numeric(7, 1) check (km_semana >= 0),
  desnivel_semana_m integer check (desnivel_semana_m >= 0),
  carreras_temporada integer check (carreras_temporada >= 0),
  notas text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger measurements_updated_at before update on public.measurements
  for each row execute function public.set_updated_at();

-- Privado: solo admin por ahora. El acceso de entrenadores se agrega después.
alter table public.measurements enable row level security;
create policy "mediciones: solo admin" on public.measurements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Accesos a estadísticas ────────────────────────────────────────────────────
create type public.solicitud_estado as enum ('pendiente', 'aprobada', 'rechazada');

create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(trim(nombre)) between 1 and 200),
  correo text not null check (correo ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(correo) <= 320),
  rol text not null default '' check (length(rol) <= 200),
  social_url text not null default '' check (length(social_url) <= 500),
  acepta_actualizaciones boolean not null default false,
  estado public.solicitud_estado not null default 'pendiente',
  notas text not null default '',
  created_at timestamptz not null default now(),
  decidido_at timestamptz
);
create index access_requests_estado_idx on public.access_requests (estado, created_at desc);

alter table public.access_requests enable row level security;
-- Cualquiera puede enviar una solicitud (formulario público); no puede leerlas.
create policy "solicitudes: envío público" on public.access_requests
  for insert to anon, authenticated
  with check (estado = 'pendiente' and decidido_at is null and notas = '');
create policy "solicitudes: admin gestiona" on public.access_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.allowed_emails (
  email text primary key check (email = lower(email)),
  nombre text not null default '',
  acepta_actualizaciones boolean not null default false,
  request_id uuid references public.access_requests (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.allowed_emails enable row level security;
create policy "accesos: admin gestiona" on public.allowed_emails
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Storage: bucket público "media" (fotos y videos) ──────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm'])
on conflict (id) do nothing;

create policy "media: admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin actualiza" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media: admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
