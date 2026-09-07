# Spec: 10 — Tabla de invitaciones y parent_children

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: `08-tabla-usuarios.md`, migración `create_rooms_and_children` (rooms/children)
- **Autor**: opencode

## Objetivos
- Crear las tablas `invitations` y `parent_children`, los enums `relationship_type` e `invitation_status`, el trigger `handle_new_user` (AFTER INSERT en `auth.users`) y las políticas RLS, para que el flujo "invitar padre → activar cuenta" (SPEC 10) funcione de punta a punta.

## Data model

### Enums
- `relationship_type` = `father`, `mother`, `guardian`.
- `invitation_status` = `pending`, `accepted`, `expired`, `cancelled`.

### `invitations`
| Campo          | Tipo                        | Notas                                     |
| -------------- | --------------------------- | ----------------------------------------- |
| `id`           | `uuid` PK                   | default `gen_random_uuid()`.              |
| `child_id`     | `uuid` FK → `children`      | ON DELETE CASCADE.                        |
| `invited_by`   | `uuid` FK → `users`         | Staff que invita.                         |
| `full_name`    | `text`                      |                                           |
| `email`        | `text`                      | Índice para el check de duplicados.       |
| `relationship` | `relationship_type`         |                                           |
| `code`         | `text` UNIQUE               | Código corto, ej. `7K4P9`.                |
| `status`       | `invitation_status`         | default `pending`.                        |
| `expires_at`   | `timestamptz`               | default `now() + interval '7 days'`.      |
| `accepted_at`  | `timestamptz` null          |                                           |
| `created_at`   | `timestamptz`               | default `now()`.                          |

### `parent_children`
| Campo          | Tipo                  | Notas                                    |
| -------------- | --------------------- | ---------------------------------------- |
| `id`           | `uuid` PK             | default `gen_random_uuid()`.             |
| `parent_id`    | `uuid` FK → `users`   | ON DELETE CASCADE.                       |
| `child_id`     | `uuid` FK → `children`| ON DELETE CASCADE.                       |
| `relationship` | `relationship_type`   |                                          |
| `created_at`   | `timestamptz`         | default `now()`.                         |
|                |                       | UNIQUE (`parent_id`, `child_id`).        |

### Trigger `handle_new_user`
`AFTER INSERT ON auth.users` (SECURITY DEFINER, `set search_path = public`): inserta la fila en `public.users` con `id = NEW.id`, `role` = `raw_user_meta_data->>'role'` (default `'parent'`), `daycare_id` y `full_name` desde `raw_user_meta_data`, `status = 'active'`. Usa `on conflict (id) do nothing` como guard. No es invocable vía RPC (EXECUTE revocado).

### Helper `has_staff_access_to_child`
Función `boolean` SECURITY DEFINER usada por las políticas RLS: true si el `auth.uid()` actual es `staff`/`admin` del daycare al que pertenece la sala del niño.

## RLS
- `invitations`:
  - `select`: staff del daycare del niño.
  - `insert`: staff del daycare del niño (`with check`).
  - `update`: staff del daycare del niño **o** `auth.jwt()->>'email' = email` (el invitado acepta/activa).
- `parent_children`:
  - `select`: `parent_id = auth.uid()` o staff del daycare del niño.
  - `insert`: `parent_id = auth.uid()` o staff del daycare del niño (`with check`).

## Migración
- Archivo: `supabase/migrations/20260906000101_create_invitations_and_parent_children.sql`.
- Aplicada al proyecto remoto vía MCP `apply_migration` (`name: create_invitations_and_parent_children`).

## Criterios de aceptación
- [ ] Existen los enums `relationship_type` (`father`, `mother`, `guardian`) e `invitation_status` (`pending`, `accepted`, `expired`, `cancelled`).
- [ ] Existen `invitations` y `parent_children` con columnas, PKs, FKs y UNIQUE del esquema.
- [ ] Existe el trigger `handle_new_user` en `auth.users` (AFTER INSERT, SECURITY DEFINER).
- [ ] `invitations` y `parent_children` tienen RLS habilitado con políticas para staff/invitado/padre.
- [ ] `get_advisors` (security) no reporta tablas sin RLS.