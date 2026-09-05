# Spec: 08 — Tabla users y sus enums

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: SPEC 07
- **Autor**: opencode

## Objetivos
- Crear la tabla `users` en Supabase con sus enums (`user_role`, `user_status`) y sembrar un usuario staff de prueba asignado a un daycare existente, siguiendo el patrón de migración vía MCP.

## Alcance (Scope)
### Incluido
- Enums `user_role` (`staff`, `parent`, `admin`) y `user_status` (`pending`, `active`).
- Tabla `users` con todas las columnas del esquema (`@docs`): `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `notify_on_post`, `daily_summary_enabled`, `created_at`, `updated_at`.
- Trigger `updated_at` automático (extensión `moddatetime`), reutilizando la convención de `daycares`.
- Habilitar RLS en `users` con políticas de `select`, `insert`, `update` y `delete` restringidas a `authenticated` del mismo daycare.
- Seed de un usuario staff (`full_name: "Staff Patrick"`, `role: 'staff'`, `status: 'active'`) asignado al daycare sembrado en SPEC 07.
- Registro del histórico de migración en el proyecto remoto + archivo SQL local en `supabase/migrations/`.

### Excluido
- Trigger `AFTER INSERT` en `auth.users` (fila creada por signup) → spec de autenticación futuro.
- Autenticación real (email/password) — no se toca `auth.users`.
- Enums no relacionados con `users` (`relationship_type`, `invitation_status`, `post_type`, `child_status`) → se crean en sus specs.
- Resto de tablas del esquema (rooms, children, posts, etc.).
- CRUD / UI de usuarios.

## Data model
`users` (igual a `@docs`, + `updated_at`):

| Campo                     | Tipo                    | Notas                                  |
| ------------------------- | ----------------------- | -------------------------------------- |
| `id`                      | `uuid` PK               | FK → `auth.users(id)`. El seed usa un uuid arbitrario por ahora. |
| `daycare_id`              | `uuid` FK → `daycares`  |                                        |
| `role`                    | `user_role`             | `staff` / `parent` / `admin`.          |
| `status`                  | `user_status`           | Default `active`.                      |
| `full_name`               | `text`                  |                                        |
| `avatar_url`              | `text`                  | Nullable.                              |
| `notify_on_post`          | `boolean` default `true`|                                        |
| `daily_summary_enabled`   | `boolean` default `true`|                                        |
| `created_at` / `updated_at`| `timestamptz`          |                                        |

Enums:
- `user_role` = `staff`, `parent`, `admin`.
- `user_status` = `pending`, `active`.

## Implementation plan
1. Crear el archivo de migración local `supabase/migrations/<timestamp>_create_users_table.sql` con: enums, tabla `users`, trigger `updated_at`, RLS + políticas, y seed del staff.
2. Aplicar la misma migración vía MCP `apply_migration` (`name: create_users_table`) para que quede sync con el proyecto remoto.
3. Verificar: `execute_sql` (`select * from users` y `select * from daycares`) para confirmar que el staff quedó asignado al daycare existente.
4. Ejecutar `get_advisors` (security) para confirmar que `users` tiene RLS sin alertas.
5. Confirmar `npm run build` pasa sin errores (no hay cambios de app).

## Criterios de aceptación
- [ ] Existen los enums `user_role` y `user_status` con sus valores correctos en `public`.
- [ ] `users` existe en `public` con las 10 columnas y PK `uuid`.
- [ ] `updated_at` se actualiza automáticamente al modificar una fila.
- [ ] `users.daycare_id` es FK a `daycares.id`.
- [ ] RLS habilitado en `users` con políticas de `select`, `insert`, `update` y `delete` para `authenticated`.
- [ ] Existe una fila staff (`full_name: "Staff Patrick"`, `role: 'staff'`, `status: 'active'`) asignada a un daycare del SPEC 07.
- [ ] El archivo SQL de migración existe en `supabase/migrations/` y está sincronizado con lo aplicado al proyecto remoto.
- [ ] `get_advisors` (security) no reporta `users` sin RLS.
- [ ] `npm run build` sigue pasando.

## Decisiones
- **Sí:** solo enums de `users` (`user_role`, `user_status`) en este spec. Los demás enums se crean en sus specs respectivos para no adelantar trabajo.
- **Sí:** trigger `updated_at` con `moddatetime`. Consistente con SPEC 07.
- **Sí:** RLS con políticas `select`/`insert`/`update`/`delete` para `authenticated`. Se pidió explícitamente acceso restringido.
- **Sí:** diferir el trigger `AFTER INSERT` en `auth.users` al próximo spec de autenticación. Evita mezclar auth con la fundación de la tabla.
- **Sí:** el seed del staff es una fila directa en `public.users` con uuid arbitrario (no vinculado a auth todavía). Simple; se conectará a `auth.users` cuando exista el trigger de signup.
- **No:** el resto de enums y tablas del esquema (specs futuros).
- **No:** autenticación / signup real.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| `id` del seed no corresponde a ningún `auth.users` (auth aún no existe) | Aceptado para esta fase; se reconcilia en el spec de autenticación con el trigger de signup |
| Política RLS de escritura con predicado de propiedad puede ser invasiva para staff | Se prioriza que `staff` pueda operar dentro de su daycare; se refina en specs de UI |
| `moddatetime` puede no estar instalado | `create extension if not exists` en la misma migración |

## Qué NO está en este spec
- Trigger de `auth.users` / signup.
- Autenticación real (email, password, confirmación).
- Otros enums y tablas del esquema.
- CRUD / UI de usuarios.
- Vista de administración de usuarios.