-- Estadísticas para entrenadores: quien está en allowed_emails (o es admin) puede leer
-- las mediciones. Escribir sigue siendo solo del admin.

-- ¿La sesión actual tiene acceso a las estadísticas?
create function public.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1 from public.allowed_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_allowed() from public;
grant execute on function public.is_allowed() to authenticated;

-- ¿Este correo tiene acceso? Se usa antes de enviar el código, para no crear usuarios
-- ni mandar correos a direcciones sin acceso.
create function public.is_allowed_email(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.allowed_emails where email = lower(trim(p_email)))
      or exists (select 1 from public.admins where email = lower(trim(p_email)));
$$;
revoke all on function public.is_allowed_email(text) from public;
grant execute on function public.is_allowed_email(text) to anon, authenticated;

create policy "mediciones: lectura con acceso" on public.measurements
  for select to authenticated using (public.is_allowed());
