# Spec: 09 — Persistencia de niños y perfil real (/kids + /kids/[id] con Supabase)

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: SPEC 04, SPEC 07, SPEC 08
- **Autor**: opencode

## Objetivos
- Persistir el alta de niños: "Agregar niño" inserta en `children` (Supabase) y el niño queda guardado entre sesiones.
- Hacer que `/kids` muestre los niños reales de la BD agrupados por sala (orden alfabético) y clickeables a su perfil.
- Convertir el perfil `/kids/[slug]` (SSG con 8 mocks) en `/kids/[id]` dinámico que lee al niño real de Supabase, conservando el layout actual.
- Eliminar los 8 mocks de `lib/kids.ts`.

## Alcance (Scope)
### Incluido
- **`app/kids/page.tsx`** (cliente): fetch completo de `children` + `rooms`, mapeo ChildRow → view-model, render real por sala (orden alfabético, conteo, KidCards con `href="/kids/[id]"`). Eliminación del estado `addedKids` en memoria.
- **`components/kids/AddKidModal.tsx`**: al guardar, INSERT en `children` con mapping nombre de sala → `room_id`, `allergy_tags` tal cual el usuario las escribe (minúsculas), `enrolled_at` = hoy, `photo_consent` = true, `status` = active.
- **`app/kids/[id]/page.tsx`** (nuevo, server, dinámico): lee el niño + su sala de Supabase y renderiza el layout actual del perfil (nombre, botón "Editar" #, fecha de nacimiento, sala, ingreso, bloque alergias/notas si hay datos, "Resumen del día" #, card PADRES VINCULADOS con modal estático existente). `notFound()` si el id no existe. Eliminación de `app/kids/[slug]/`.
- **`lib/kids.ts`**: eliminación del array `kids` y `getKidBySlug`; se conservan los tipos (`Kid`, `ParentLink`) y se agregan los mappers/helpers (ChildRow → `Kid`, formato de fecha, colores de avatar por nombre, parseo de `allergy_tags`).
- Secciones de `/kids` en orden alfabético de sala.
- Migración SQL: **ninguna** (tabla `children` y policies insert/select de daycare ya creadas en SPEC 08).

### Excluido
- Edición / archivado de niños, desvincular padres.
- Persistencia real de la vinculación de padres (`parent_children`, `invitations`, email de invitación, cuenta de padre). Va en un spec futuro.
- Cambiar el feed (`/`), que sigue con posts mock.
- Buscador de `/kids` (sigue como placeholder).
- Responsive/móvil.
- Normalizar `allergy_tags` a inglés (diccionario) ni documentación BD en `specs/database/`.

## Data model
No se crean nuevas tablas. Se usa `children` y `rooms` de SPEC 08.

```sql
-- children (ya existe, SPEC 08). Alta con:
-- full_name       text        (nombre del modal)
-- birth_date      date        (dd/mm/aaaa del modal)
-- room_id         uuid        (id de la sala elegida por nombre)
-- enrolled_at     date        = 'hoy' (DATE 'yyyy-mm-dd')
-- medical_notes   text        (del modal, nullable)
-- allergy_tags    text[]      = tags del input separadas por coma, minúsculas, trimmed
-- photo_consent   boolean     = true
-- status          child_status = 'active'
```

Mapeo ChildRow → `Kid` (view-model de `KidCard`/perfil):
- `slug` = `id` (uuid) → `href="/kids/${id}"`.
- `firstName`/`lastName` = split de `full_name` (1er token / resto).
- `age` = de `birth_date`; `birthday` = "12 mar 2022" y `enrollment` = "feb 2025" (mismo formato que el template, helpers en `lib/kids.ts`).
- `avatarBg`/`avatarColor` = derivados de un hash estable del nombre (paleta existente).
- `allergy` = `{ label: allergy_tags.join(", ").toUpperCase() , note: medical_notes ?? "" }` solo si hay tags.
- `needsLink` = false; `linkedParents` = [] (vinculación persistente es spec futuro).

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| `GET /kids` con sesión | Secciones por sala (orden alfabético) · N niños, con KidCards reales clickeables a `/kids/[id]` |
| Guardar en "Agregar niño" | INSERT en `children`; el niño aparece en su sala en `/kids` y persiste al recargar |
| `GET /kids/[id]` con sesión | Perfil real del niño (mismo layout que hoy) o 404 si no existe |
| `GET /kids/[id]` sin sesión | Redirect 307 → `/login` (proxy existente) |
| `GET /kids/[slug]` de mock | 404 (los slugs de los 8 mocks dejan de existir) |

## Implementation plan
1. **`/kids` render real**: ampliar el fetch de `children` a `id, room_id, full_name, birth_date, enrolled_at, medical_notes, allergy_tags` y renderizar los niños reales con `KidCard` (`href="/kids/[id]"`), secciones por sala en orden alfabético. Se conserva el `addedKids` en memoria por ahora. Verificar: 3 secciones, 0 niños; un niño insertado a mano en BD aparece en su sala.
2. **Alta persistente**: `AddKidModal` deja de construir un `Kid` en memoria; al guardar hace INSERT en `children` (mapping sala → `room_id`, tags en minúsculas, `enrolled_at` hoy, `photo_consent` true) y tras éxito re-fetchea o agrega el niño a la lista y cierra el modal. Eliminar el estado `addedKids`. Verificar: el niño persiste al recargar y la fila existe en BD.
3. **Perfil real**: crear `app/kids/[id]/page.tsx` (server, dinámico, `params` `Promise`) que lee el niño + sala de Supabase con `createServerClient` y renderiza el layout actual del perfil con datos reales; `notFound()` si no existe; eliminar `app/kids/[slug]/`. Verificar: navegación desde `/kids`, 404 con id inventado, redirect sin sesión.
4. **Limpiar `lib/kids.ts`**: eliminar el array `kids` y `getKidBySlug`; conservar tipos y mappers. Verificar con grep que ningún archivo los importe.
5. `npm run build` y `eslint` (código de app) sin errores.

## Criterios de aceptación
- [ ] Guardar en "Agregar niño" inserta la fila en `children` (RLS insert del daycare) con `full_name`, `birth_date`, `room_id` (según nombre de sala), `allergy_tags` en minúsculas tal cual se ingresó, `enrolled_at` = hoy, `photo_consent` = true, `status` = active.
- [ ] Al recargar `/kids`, el niño guardado sigue apareciendo (persistencia real, sin estado en memoria).
- [ ] `/kids` muestra los niños reales agrupados por sala, secciones en orden alfabético y conteo por sala correcto.
- [ ] Cada `KidCard` real navega a `/kids/[id]`.
- [ ] `/kids` ya no tiene el estado `addedKids` en memoria.
- [ ] `/kids/[id]` renderiza el perfil con datos reales (nombre, edad, fecha de nacimiento, sala, ingreso) y el bloque alergias/notas solo si hay datos.
- [ ] `/kids/[id]` conserva "Editar" (#), "Resumen del día" (#) y el card PADRES VINCULADOS con botón "Vincular otro padre" que abre el modal estático existente (sin persistir).
- [ ] `/kids/[id]` con id inexistente → 404.
- [ ] `/kids/[id]` sin sesión → redirect a `/login` (proxy).
- [ ] `lib/kids.ts` ya no exporta el array `kids` ni `getKidBySlug` y nada en el repo los importa.
- [ ] `npm run build` sin errores de tipos ni lint (código de app).

## Decisiones
- **Sí:** un solo spec 09 que cubre ambos bloques (alta persistente + perfil real). Están acoplados: no se puede clickear un niño real hasta que la alta persista. (Elegido por el usuario.)
- **Sí:** alta persistente con INSERT directo a `children` desde el browser (policy insert por daycare ya existe desde SPEC 08). (Elegido por el usuario.)
- **Sí:** defaults al insertar `enrolled_at` = hoy, `photo_consent` = true, `status` = active (el modal no captura esos campos).
- **Sí:** `allergy_tags` tal cual el usuario las escribe, en minúsculas. Sin diccionario inglés/UI en este spec. (Elegido por el usuario.)
- **Sí:** vinculación de padres sigue estática (modal SPEC 05). La persistencia del vínculo (`parent_children`, `invitations`, email) va a un spec futuro. (Elegido por el usuario.)
- **Sí:** perfil real como server component dinámico por uuid (patrón de `/` con `createServerClient`). (Elegido por el usuario.)
- **Sí:** se eliminan los 8 mocks de `lib/kids.ts` (sin uso tras /kids y perfil reales). (Elegido por el usuario.)
- **Sí:** secciones de `/kids` en orden alfabético de sala (predictible para UI/screenshots). (Elegido por el usuario.)
- **No:** edición/archivado, desvincular padres, cambiar el feed, buscador funcional, responsive, normalización de alergias a inglés, doc BD en `specs/database/`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| INSERT falla si el nombre de sala no se mapea a `room_id` | El modal recibe las salas con su `id`; se valida antes de insertar y se muestra error si falla |
| Mapeo ChildRow → `Kid` incompleto rompe `KidCard` | Mappers/helpers centralizados en `lib/kids.ts`; criterio de aceptación con un niño real |
| Refactor `[slug]` → `[id]` deja links rotos a slugs de mocks | Los únicos que usaban slugs eran `/kids` (refactorizado) y `[slug]` (eliminado); se verifica con grep |
| Perfil siempre muestra 0 padres vinculados | Esperado: la vinculación persistente es spec futuro; el card muestra lista vacía + botón "Vincular otro padre" (estático) |

## Qué NO está en este spec
- Editar / archivar niños, desvincular padres.
- Persistencia de la vinculación de padres (invitación real, cuentas de padre).
- Cambiar el feed (`/`).
- Buscador funcional.
- Normalización de `allergy_tags` a inglés.
- Documentación BD en `specs/database/`.
- Responsive/móvil.