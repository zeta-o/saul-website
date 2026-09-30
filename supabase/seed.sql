-- Solo desarrollo local (supabase db reset). En producción, dar de alta el admin a mano.
insert into public.admins (email) values ('admin@saul.local') on conflict do nothing;
