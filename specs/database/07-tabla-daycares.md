# Spec: 07 — Tabla daycares (fundación de BD)

- **Estado**: Approved
- **Fecha**: 2026-08-28
- **Depende de**: Ninguno (autónomo)
- **Autor**: opencode

## Objetivos
- Crear la primera tabla `daycares` en Supabase (campo a campo según `@docs`, + `updated_at`) y aplicarla a la BD remota siguiendo el patrón de migraciones vía MCP `apply_migration`.

## Alcance (Scope)
### Incluido
- Migración SQL que crea la tabla `daycares` con `id` (uuid PK, default `gen_random_uuid()`), `name` (text), `created_at` y `updated_at` (timestamptz).
- Trigger `updated_at` automático (extensión `moddatetime`).
- Habilitar RLS en `daycares` + política inicial de `select` para `authenticated`.
- Sembrar una fila de ejemplo "Guardería Sala Soles".
- Registro del histórico de migración en el proyecto remoto.

### Excluido
- El resto de tablas del esquema (rooms, children, users, posts, etc.) — specs futuros.
- Enums y triggers de `auth.users` (signup).
- Configuración de exposición a la Data API si no fuera automática.
- Seed masivo o datos de prueba adicionales.

## Data model
`daycares` (igual a `@docs`, + `updated_at`):

| Campo        | Tipo          | Notas                          |
| ------------ | ------------- | ------------------------------ |
| `id`         | `uuid` PK     | default `gen_random_uuid()`    |
| `name`       | `text`        | Ej. "Guardería Sala Soles".    |
| `created_at` | `timestamptz` | default `now()`                |
| `updated_at` | `timestamptz` | default `now()`, auto por trigger |

## Implementation plan
1. Ejecutar migración vía MCP `apply_migration` (`name: create_daycares_table`) con el DDL:
   - `create extension if not exists moddatetime`
   - `create table daycares (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now())`
   - `create trigger handle_updated_at before update on daycares for each row execute function moddatetime('updated_at')`
2. Habilitar RLS y crear política `select` para `authenticated`.
3. Insertar fila de ejemplo "Guardería Sala Soles".
4. Verificar: `execute_sql` (`select * from daycares`), `get_advisors` (security) para confirmar RLS sin alertas.
5. Confirmar exposición a la Data API / `GRANT` a `anon` y `authenticated` si es necesario.

## Criterios de aceptación
- [ ] `daycares` existe en `public` con las 4 columnas y PK `uuid`.
- [ ] `updated_at` se actualiza automáticamente al modificar una fila.
- [ ] RLS habilitado y política de `select` presente.
- [ ] Existe la fila "Guardería Sala Soles".
- [ ] `get_advisors` (security) no reporta `daycares` sin RLS.
- [ ] `npm run build` sigue pasando (no hay cambios de app).

## Decisiones
- **Sí:** vía MCP `apply_migration` (no hay CLI local ni carpeta `supabase/`); registra el histórico remoto.
- **Sí:** incluir `updated_at` (consistencia con el resto del esquema), aunque `@docs` solo lista `created_at` para `daycares`.
- **Sí:** RLS + política desde la primera migración (práctica segura de Supabase).
- **Sí:** sembrar una fila de ejemplo para poder probar la conexión de datos.
- **No:** el resto de tablas ni triggers de `auth.users` (specs futuros).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Política RLS con predicado de propiedad requiere `users` (aún no existe) | Política inicial conservadora para `authenticated`; se refina cuando existan `users`/`parent_children` |
| `moddatetime` puede no estar instalado | `create extension if not exists` en la misma migración |
| Data API puede no exponer la tabla nueva | Verificar acceso y `GRANT` a `anon`/`authenticated` si hace falta |

## Qué NO está en este spec
- Otras 12 tablas y enums del esquema.
- Autenticación / trigger de `auth.users`.
- Seed masivo.
