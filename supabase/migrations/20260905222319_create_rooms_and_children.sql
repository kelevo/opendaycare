create extension if not exists moddatetime;

create type public.child_status as enum ('active', 'archived');

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  daycare_id uuid not null references public.daycares(id),
  name text not null,
  created_at timestamptz not null default now()
);

create index rooms_daycare_id_idx on public.rooms (daycare_id);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id),
  full_name text not null,
  birth_date date not null,
  enrolled_at date not null,
  medical_notes text,
  allergy_tags text[] not null default '{}',
  photo_consent boolean not null default true,
  status public.child_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index children_room_id_idx on public.children (room_id);

create trigger handle_updated_at
  before update on public.children
  for each row
  execute function moddatetime('updated_at');

alter table public.rooms enable row level security;
alter table public.children enable row level security;

create policy "Rooms select same daycare" on public.rooms
  for select
  to authenticated
  using (daycare_id = public.current_daycare_id());

create policy "Rooms insert same daycare" on public.rooms
  for insert
  to authenticated
  with check (daycare_id = public.current_daycare_id());

create policy "Rooms update same daycare" on public.rooms
  for update
  to authenticated
  using (daycare_id = public.current_daycare_id())
  with check (daycare_id = public.current_daycare_id());

create policy "Rooms delete same daycare" on public.rooms
  for delete
  to authenticated
  using (daycare_id = public.current_daycare_id());

create policy "Children select same daycare" on public.children
  for select
  to authenticated
  using (room_id in (select id from public.rooms where daycare_id = public.current_daycare_id()));

create policy "Children insert same daycare" on public.children
  for insert
  to authenticated
  with check (room_id in (select id from public.rooms where daycare_id = public.current_daycare_id()));

create policy "Children update same daycare" on public.children
  for update
  to authenticated
  using (room_id in (select id from public.rooms where daycare_id = public.current_daycare_id()))
  with check (room_id in (select id from public.rooms where daycare_id = public.current_daycare_id()));

create policy "Children delete same daycare" on public.children
  for delete
  to authenticated
  using (room_id in (select id from public.rooms where daycare_id = public.current_daycare_id()));

insert into public.rooms (daycare_id, name)
select d.id, r.name
from public.daycares d
cross join (values ('Soles'), ('Nubes'), ('Estrellas')) as r(name)
where d.name = 'Guardería Sala Soles'
  and not exists (
    select 1 from public.rooms ro where ro.daycare_id = d.id and ro.name = r.name
  );