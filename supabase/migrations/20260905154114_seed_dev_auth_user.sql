-- Seed: auth user de desarrollo para verificar login (SPEC 07).
-- Crea el usuario patrick@gmail.com en auth.users + auth.identities
-- y lo vincula a la fila de staff existente en public.users.

do $$
declare
  v_user_id uuid := '11111111-2222-3333-4444-555555555555'::uuid;
  v_email text := 'patrick@gmail.com';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, invited_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    phone_change_token, email_change_token_current, reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000', v_user_id,
    'authenticated', 'authenticated', v_email,
    crypt('1234567890', gen_salt('bf')),
    now(), now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    '{}'::jsonb,
    now(), now(), false, false,
    '', '', '', '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id
  ) values (
    v_email, v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email),
    'email', now(), now(), now(), gen_random_uuid()
  )
  on conflict (provider_id, provider) do nothing;

  update public.users
     set id = v_user_id,
         full_name = 'Patrick'
   where full_name = 'Staff Patrick'
     and id <> v_user_id;

  if not exists (
    select 1 from public.users where id = v_user_id
  ) then
    insert into public.users (id, daycare_id, role, status, full_name)
    select v_user_id, id, 'staff', 'active', 'Patrick'
    from public.daycares
    limit 1;
  end if;
end $$;