-- Spec 10: Invitación y activación de cuenta de padre.
-- Enums relationship_type / invitation_status, tablas invitations y parent_children,
-- trigger handle_new_user (AFTER INSERT ON auth.users) y RLS.

create type public.relationship_type as enum ('father', 'mother', 'guardian');
create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'cancelled');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  invited_by uuid not null references public.users(id),
  full_name text not null,
  email text not null,
  relationship public.relationship_type not null,
  code text not null unique,
  status public.invitation_status not null default 'pending',
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index invitations_child_id_idx on public.invitations (child_id);
create index invitations_invited_by_idx on public.invitations (invited_by);
create index invitations_email_idx on public.invitations (email);

create table public.parent_children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  relationship public.relationship_type not null,
  created_at timestamptz not null default now(),
  unique (parent_id, child_id)
);

create index parent_children_parent_id_idx on public.parent_children (parent_id);
create index parent_children_child_id_idx on public.parent_children (child_id);

-- Helper: staff/admin del daycare del niño que opera sus invitaciones/vínculos.
create or replace function public.has_staff_access_to_child(p_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.rooms r
    where r.id = (select c.room_id from public.children c where c.id = p_child_id)
      and r.daycare_id = (
        select u.daycare_id
        from public.users u
        where u.id = auth.uid()
          and u.role in ('staff', 'admin')
      )
  );
$$;

revoke all on function public.has_staff_access_to_child(uuid) from public, anon;
grant execute on function public.has_staff_access_to_child(uuid) to authenticated;

-- Trigger: crea la fila public.users al registrarse un padre (AFTER INSERT ON auth.users).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data is null then
    return new;
  end if;

  insert into public.users (id, daycare_id, role, status, full_name)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'daycare_id')::uuid,
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'parent')::public.user_role,
    'active',
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger handle_new_user
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.invitations enable row level security;
alter table public.parent_children enable row level security;

create policy "Invitations select daycare staff" on public.invitations
  for select
  to authenticated
  using (public.has_staff_access_to_child(child_id));

create policy "Invitations insert daycare staff" on public.invitations
  for insert
  to authenticated
  with check (public.has_staff_access_to_child(child_id));

create policy "Invitations update daycare staff or invitee" on public.invitations
  for update
  to authenticated
  using (public.has_staff_access_to_child(child_id) or auth.jwt()->>'email' = email)
  with check (public.has_staff_access_to_child(child_id) or auth.jwt()->>'email' = email);

create policy "Parent children select parent or staff" on public.parent_children
  for select
  to authenticated
  using ((parent_id = auth.uid()) or public.has_staff_access_to_child(child_id));

create policy "Parent children insert parent or staff" on public.parent_children
  for insert
  to authenticated
  with check ((parent_id = auth.uid()) or public.has_staff_access_to_child(child_id));