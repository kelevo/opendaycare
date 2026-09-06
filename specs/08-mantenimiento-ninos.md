# Spec 08 — Mantenimiento de niños: tablas `rooms` y `children` + `/kids` con datos reales

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: SPEC 04, SPEC 07, schema `db-schema` (secciones de `rooms` y `children`)
- **Autor**: opencode

## Objetivos

Crear las tablas `rooms` y `children` siguiendo el db-schema, sembrar 3 salas por defecto (Soles, Nubes, Estrellas) ligadas a la guardería existente, y hacer que la pantalla `/kids` lea salas y niños reales de Supabase (sin persistencia de alta, que va a un spec futuro).

## Alcance (Scope)

### Incluido

- Migración SQL: tablas `rooms` y `children` (columnas exactas del db-schema), enum `child_status`, índices, trigger `moddatetime`, RLS acotado por daycare (patrón de la tabla `users`) y seed de 3 salas.
- `children` queda **vacía** (sin seed).
- `/kids`: deja de usar los 8 niños mock de `lib/kids.ts` y lee `rooms` + `children` de Supabase; muestra las 3 salas con su sección y conteo (0 niños cada una).
- Modal "Agregar niño": el select SALA se llena desde Supabase (las 3 salas reales). El guardado sigue siendo **en memoria** (sin persistir).
- Eliminar `lib/rooms.ts` (deja de usarse).

### Excluido

- Alta/edición/archivado persistente de niños (`child_status` queda listo pero sin UI). Va en un spec futuro.
- Migrar los 8 niños mock a `children`.
- Cambiar el feed (`/`), `/kids/[slug]` ni `CrearPublicacionModal` (siguen con `lib/kids.ts` mock — inconsistencia conocida y aceptada).
- Buscador de `/kids` (sigue como placeholder).
- Responsive/móvil.
- Documentación de BD en `specs/database/` (solo spec de feature + migración).

## Data model (BD)

```sql
-- enum
child_status: 'active' | 'archived'

-- rooms
id uuid PK, daycare_id uuid FK → daycares, name text, created_at timestamptz
-- children
id uuid PK, room_id uuid FK → rooms, full_name text, birth_date date,
enrolled_at date, medical_notes text nullable, allergy_tags text[] default '{}',
photo_consent boolean default true, status child_status default 'active',
created_at / updated_at timestamptz, trigger handle_updated_at (moddatetime)
```

- RLS: `rooms` → `daycare_id = current_daycare_id()` (reusa la función existente en `20260905164456_create_users_table.sql`). `children` → `room_id IN (SELECT id FROM rooms WHERE daycare_id = current_daycare_id())`. Policies de select/insert/update/delete para `authenticated`.
- Seed: insert de `('Soles'), ('Nubes'), ('Estrellas')` contra el `daycares` existente ("Guardería Sala Soles").

## Entradas / Salidas

| Entrada | Salida |
|---|---|
| `GET /kids` con sesión | 3 secciones "SALA SOLES · 0 niños", "SALA NUBES · 0 niños", "SALA ESTRELLAS · 0 niños" (sin mocks) |
| `GET /kids` sin sesión | Redirect 307 → `/login` (proxy existente) |
| Abrir "Agregar niño" | Modal con SALA listando las 3 salas reales |
| Guardar en el modal | Niño en memoria (sesión actual); no persiste |
| Query a `rooms` | Solo filas de la guardería del usuario logueado (RLS) |
| Query a `children` | Solo niños de salas de la guardería del usuario (RLS) |

## Implementation plan

1. **Migración** `supabase/migrations/YYYYMMDDHHMMSS_create_rooms_and_children.sql`: enum `child_status`, tablas `rooms` + `children`, índices, trigger `handle_updated_at`, RLS/policies, seed de 3 salas. Aplicar vía MCP y verificar: `children` con 0 filas, `rooms` con 3 filas (Soles, Nubes, Estrellas) para la guardería sembrada.
2. **`/kids` lee de Supabase**: deja de importar `kids` de `lib/kids.ts`; fetch de `rooms` + `children` (browser client), agrupa por sala y renderiza secciones "SALA {name} · {n} niños" + grilla con `KidCard` (vacía por ahora). Se conserva el botón "Agregar niño" y el estado `addedKids` en memoria. Verificar con sesión: 3 salas, 0 niños; sin sesión: redirect a `/login`.
3. **Modal con salas reales**: `AddKidModal` recibe `rooms` como prop (desde Supabase, fetch en `/kids`) y lo usa para el select SALA en lugar de `lib/rooms.ts`. Eliminar `lib/rooms.ts`. Verificar: el select lista Soles, Nubes, Estrellas.
4. `npm run build` y lint de los archivos de app sin errores.

## Criterios de aceptación

- [ ] Existen las tablas `rooms` y `children` con las columnas del db-schema, enum `child_status`, índices y trigger `moddatetime`.
- [ ] RLS habilitado en `rooms` y `children` con políticas acotadas por daycare; un usuario autenticado de la guardería puede leerlas.
- [ ] `rooms` tiene exactamente 3 filas (Soles, Nubes, Estrellas) ligadas a "Guardería Sala Soles".
- [ ] `children` tiene 0 filas.
- [ ] `/kids` con sesión muestra las 3 salas con conteo "0 niños" y no muestra los 8 mocks.
- [ ] `/kids` ya no importa `lib/kids.ts` ni `lib/rooms.ts`.
- [ ] El select SALA del modal "Agregar niño" lista las 3 salas reales desde Supabase.
- [ ] Guardar en el modal agrega el niño en memoria (sin persistencia).
- [ ] `/kids` sin sesión redirige a `/login`.
- [ ] `npm run build` sin errores de tipos ni lint (código de app).

## Decisiones

- **Sí:** tablas del db-schema al pie de la letra (`rooms`, `children`), RLS por daycare reusando `current_daycare_id()`. (Convención del repo.)
- **Sí:** seed de 3 salas (Soles, Nubes, Estrellas); **se descarta Arcoíris** que hoy existe en `lib/rooms.ts`. (Elegido por el usuario.)
- **Sí:** `children` vacía; no se migran los 8 mocks. `/kids` pasa a BD y queda en 0 niños. (Elegido por el usuario.)
- **Sí:** `/kids` sigue siendo client component con fetch de Supabase; el modal en memoria se conserva. (Elección del usuario; flash de carga aceptado.)
- **Sí:** select SALA del modal con salas reales desde Supabase. (Elegido por el usuario.)
- **No:** alta/edición/archivado persistente, migración de mocks, cambio del feed/`/kids/[slug]`/modal de publicación, doc en `specs/database/`.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Policies de `children` con subquery a `rooms` mal escritas | Validar read RLS con el usuario autenticado en los criterios de aceptación |
| `/kids` cliente: flash/estado vacío inicial | Aceptado (loading por defecto); patrón de modal en memoria ya existente |
| Inconsistencia: feed y `/kids/[slug]` siguen con mocks | Documentado en este spec; se resuelve cuando esos screens lean la BD |
| `KidCard` espera `slug`/mocks y los niños de BD tienen `uuid` y `full_name` | Con 0 niños no renderiza; el mapeo a view-model se define en el spec de alta futura |

## Qué NO está en este spec

- Alta/edición/archivado persistente de niños.
- Migrar los mocks a `children`.
- Cambiar feed, `/kids/[slug]` o el modal de publicación.
- Documentación en `specs/database/`.
- Responsive/móvil.