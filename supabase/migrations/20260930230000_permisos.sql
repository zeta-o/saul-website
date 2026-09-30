-- Permisos de tabla para la Data API.
-- Los proyectos nuevos de Supabase ya no dan acceso automático a anon/authenticated sobre
-- las tablas y funciones nuevas de public. Aquí se da solo lo que usa el sitio; RLS sigue
-- decidiendo qué filas ve o cambia cada quien.

-- Las políticas llaman a is_admin(), así que ambos roles deben poder ejecutarla.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Visitantes: leer lo publicado y enviar solicitudes de acceso.
grant select on public.gallery_items, public.history_years, public.blog_posts to anon;
grant insert on public.access_requests to anon;

-- Sesión iniciada (admin): RLS limita todo a is_admin().
grant select, insert, update, delete on
  public.gallery_items, public.history_years, public.blog_posts,
  public.measurements, public.access_requests, public.allowed_emails
to authenticated;
grant select on public.admins to authenticated;

grant all on all tables in schema public to service_role;
