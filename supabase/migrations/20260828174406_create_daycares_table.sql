create extension if not exists moddatetime;

create table daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_updated_at
  before update on daycares
  for each row
  execute function moddatetime('updated_at');

alter table daycares enable row level security;

create policy "Daycares select for authenticated" on public.daycares
  for select
  to authenticated
  using (true);

insert into daycares (name) values ('Guardería Sala Soles');
