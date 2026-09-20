-- Privacy-conscious, concurrency-safe site visit counter.
-- Apply this migration to the production Supabase project before enabling
-- SUPABASE_URL / SUPABASE_SECRET_KEY in Vercel.
--
-- The application stores only a keyed HMAC of a short-lived anonymous browser
-- token + coarse request fingerprint. Raw IP addresses, user agents, cookies,
-- and authentication data are never persisted.

create table if not exists public.site_visit_counter (
  id smallint primary key check (id = 1),
  total_visits bigint not null default 0 check (total_visits >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_visit_counter (id, total_visits)
values (1, 0)
on conflict (id) do nothing;

create table if not exists public.site_visit_windows (
  window_key text primary key,
  created_at timestamptz not null default now()
);

create index if not exists site_visit_windows_created_at_idx
  on public.site_visit_windows (created_at);

alter table public.site_visit_counter enable row level security;
alter table public.site_visit_windows enable row level security;

revoke all on table public.site_visit_counter from public, anon, authenticated;
revoke all on table public.site_visit_windows from public, anon, authenticated;

grant select, insert, update, delete on table public.site_visit_counter to service_role;
grant select, insert, update, delete on table public.site_visit_windows to service_role;

create or replace function public.record_site_visit(p_window_key text)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_total bigint;
begin
  if p_window_key is null or length(p_window_key) < 32 or length(p_window_key) > 128 then
    raise exception 'invalid visit window key';
  end if;

  insert into public.site_visit_windows (window_key)
  values (p_window_key)
  on conflict (window_key) do nothing;

  if found then
    update public.site_visit_counter
       set total_visits = total_visits + 1,
           updated_at = now()
     where id = 1;
  end if;

  select total_visits
    into new_total
    from public.site_visit_counter
   where id = 1;

  return coalesce(new_total, 0);
end;
$$;

create or replace function public.get_site_visit_count()
returns bigint
language sql
security invoker
set search_path = ''
stable
as $$
  select total_visits
    from public.site_visit_counter
   where id = 1;
$$;

revoke execute on function public.record_site_visit(text) from public, anon, authenticated;
revoke execute on function public.get_site_visit_count() from public, anon, authenticated;

grant execute on function public.record_site_visit(text) to service_role;
grant execute on function public.get_site_visit_count() to service_role;

-- Cleanup is intentionally separate from the request path. Enable Supabase
-- Cron and schedule this once per hour:
--
-- select cron.schedule(
--   'cleanup-site-visit-windows',
--   '17 * * * *',
--   $$ delete from public.site_visit_windows
--      where created_at < now() - interval '2 hours' $$
-- );
