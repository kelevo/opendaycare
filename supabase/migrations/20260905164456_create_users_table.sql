create extension if not exists moddatetime;

create type public.user_role as enum ('staff', 'parent', 'admin');
create type public.user_status as enum ('pending', 'active');

create table public.users (
  id uuid primary key,
  daycare_id uuid not null references public.daycares(id),
  role public.user_role not null default 'staff',
  status public.user_status not null default 'active',
  full_name text not null,
  avatar_url text,
  notify_on_post boolean not null default true,
  daily_summary_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_daycare_id_idx on public.users (daycare_id);

create trigger handle_updated_at
  before update on public.users
  for each row
  execute function moddatetime('updated_at');

alter table public.users enable row level security;

create or replace function public.current_daycare_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select daycare_id from public.users where id = auth.uid()
$$;

revoke all on function public.current_daycare_id() from public, anon;
grant execute on function public.current_daycare_id() to authenticated;

create policy "Users select same daycare" on public.users
  for select
  to authenticated
  using (daycare_id = public.current_daycare_id());

create policy "Users insert same daycare" on public.users
  for insert
  to authenticated
  with check (daycare_id = public.current_daycare_id());

create policy "Users update same daycare" on public.users
  for update
  to authenticated
  using (daycare_id = public.current_daycare_id())
  with check (daycare_id = public.current_daycare_id());

create policy "Users delete same daycare" on public.users
  for delete
  to authenticated
  using (daycare_id = public.current_daycare_id());

insert into public.users (id, daycare_id, role, status, full_name)
select gen_random_uuid(), id, 'staff', 'active', 'Staff Patrick'
from public.daycares
limit 1;