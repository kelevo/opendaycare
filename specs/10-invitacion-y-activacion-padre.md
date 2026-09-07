# Spec: 10 — Invitación y activación de cuenta de padre (Resend)

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: SPEC 05, SPEC 07, SPEC 08, SPEC 09 (y `specs/database/08-tabla-usuarios.md`)
- **Autor**: opencode

## Objetivos
- Vincular un padre a un niño de verdad: el modal de `/kids/[id]` crea una invitación y envía un email con código vía Resend, y `/activar-cuenta` le permite al invitado crear su cuenta, vincularse al niño y aparecer como padre vinculado en el perfil.

## Alcance (Scope)
### Incluido
- Migración SQL: enums `relationship_type` e `invitation_status`, tablas `invitations` y `parent_children`, trigger `AFTER INSERT` en `auth.users` (crea la fila `users` del padre), RLS. Doc de BD en `specs/database/`.
- `POST /api/invitations` (Node): valida al staff autenticado y al niño de su daycare, rechaza invitación pendiente duplicada para el mismo email+niño, inserta en `invitations` (código, `expires_at` = +7 días) y envía el email con Resend (código + link a `/activar-cuenta?code=&email=&child=`).
- Modal `VincularPadreModal` funcional: recibe `kidId`, submit real, estados de carga/error, éxito con auto-cierre (~2s), código visible hasta enviar.
- `POST /api/activate` (Node, service role): valida la invitación (pendiente, vigente, email coincide), crea la cuenta con Supabase Auth (auto-confirm), marca la invitación `accepted` e inserta el vínculo en `parent_children`.
- `/activar-cuenta` funcional (client): prefill de código, nombre y email fijo (read-only) desde query params, campos reales (contraseña + checkbox de consentimiento requerido), errores claros, éxito → redirect a `/login?activated=1`.
- `/login` muestra un aviso de "cuenta activada" cuando llega con `?activated=1`.
- Perfil `/kids/[id]`: el card PADRES VINCULADOS lee padres reales (pendientes de `invitations` + activos de `parent_children` → `users`), con refresco tras enviar una invitación.

### Excluido
- Feed de familia (`parent` → feed propio). El login genérico de SPEC 07 sigue llevando a `/`; el feed del padre va a un spec futuro.
- Re-invitar / cancelar invitaciones pendientes (se rechaza el duplicado, no se emite de nuevo).
- Reenvío (resend email) de una invitación existente.
- Vincular una cuenta existente al invitado (si el email ya tiene cuenta → error claro).
- Edición / desvinculación de padres, avatars reales del padre.
- Rate limiting del endpoint de activación.
- Responsive/móvil.

## Data model

Enums y tablas nuevas para la migración `create_invitations_and_parent_children`:

```sql
-- enums
relationship_type: 'father' | 'mother' | 'guardian'
invitation_status: 'pending' | 'accepted' | 'expired' | 'cancelled'

-- invitations
id uuid PK default gen_random_uuid()
child_id   uuid FK → children  ON DELETE CASCADE
invited_by uuid FK → users
full_name  text
email      text
relationship relationship_type
code       text UNIQUE             -- ej. 7K4P9
status     invitation_status default 'pending'
expires_at timestamptz             -- now() + 7 days
accepted_at timestamptz null
created_at timestamptz default now()

-- parent_children
id uuid PK default gen_random_uuid()
parent_id uuid FK → users     ON DELETE CASCADE
child_id  uuid FK → children  ON DELETE CASCADE
relationship relationship_type
created_at timestamptz default now()
UNIQUE (parent_id, child_id)
```

**Trigger** `handle_new_user` (AFTER INSERT ON `auth.users`, `SECURITY DEFINER`): inserta la fila en `public.users` con `id = NEW.id`, `role = meta->>'role'` (default `'parent'`), `full_name`, `daycare_id` desde `raw_user_meta_data`, `status = 'active'`. Este es el mecanismo del db-schema y el elegido.

**RLS** (todas las políticas acotadas al daycare del niño; el invitado puede operar su propia invitación):
- `invitations`: `select`/`insert` para staff del daycare del niño; `update` para staff o `auth.jwt()->>'email' = email` (aceptar/activar).
- `parent_children`: `select` para el propio padre o staff del daycare; `insert` para `parent_id = auth.uid()` o staff.

**Mapeo de parentesco (DB en inglés, UI en español, convención del repo):**
`mother → "Mamá"`, `father → "Papá"`, `guardian → "Tutor/a"` (y a la inversa en el POST).

## Entradas / Salidas

| Entrada | Salida |
|---|---|
| Submit del modal con datos válidos | Fila en `invitations` (pending, vigencia 7d) + email Resend con código y link |
| Mismo email+niño con pending existente | 409 con aviso "ya está invitado"; no se inserta ni se reenvía |
| `POST /api/activate` con código+email válidos | Cuenta creada (auth + fila `users` role parent), invitación `accepted`, fila en `parent_children` |
| Código expirado o inválido | Error claro en `/activar-cuenta` |
| Email que no coincide con la invitación | Error claro (campo es fijo/read-only) |
| `GET /kids/[id]` | Card PADRES VINCULADOS con pendientes (invitations) y activos (parent_children → users) |
| `GET /login?activated=1` | Aviso de cuenta activada |

## Implementation plan

1. **Migración BD**: `supabase/migrations/<ts>_create_invitations_and_parent_children.sql` con enums, `invitations`, `parent_children`, trigger `handle_new_user`, RLS/policies. Aplicar vía MCP `apply_migration` y dejarla sincronizada. Crear `specs/database/10-tabla-invitaciones-y-parent-children.md`. Verificar: `execute_sql` (tablas y enums existen) y `get_advisors` (security) sin alertas de tablas sin RLS.
2. **Entorno**: instalar `resend`; agregar `RESEND_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY` a `.env.template` (y a `.env.local`, secretos, sin commitear). Prerrequisito manual en el dashboard de Supabase: desactivar la confirmación de email. Verificar: `npm run build` sigue pasando.
3. **`POST /api/invitations`** (`app/api/invitations/route.ts`, Node, consultar `node_modules/next/dist/docs/` por convención de route handlers): lee el staff con `createClient(cookies)` + `getUser()`; valida que el niño pertenezca a su daycare; valida campos, email y `relationship`; rechaza pending duplicada (409); usa el código enviado por el modal y, si colisiona (UNIQUE), regenera server-side; INSERT; `resend.emails.send` con template HTML inline (saludo, niño, sala, código, link de activación, "Vence en 7 días"). Verificar: POST con sesión staff → fila en `invitations` y email llegando a la casilla real.
4. **Modal funcional**: `VincularPadreModal` recibe `kidId`; el submit hace `fetch('/api/invitations')`, muestra estado de carga (botón deshabilitado) y errores (duplicado / genérico); éxito → panel verde + auto-cierre ~2s. `VincularPadreModalWrapper` pasa `kidId` y llama `router.refresh()` al cerrar (el perfil recarga la lista). Verificar en UI con una invitación real.
5. **`POST /api/activate`** (`app/api/activate/route.ts`, Node, service role): valida la invitación (existe, pending, no expirada, email coincide); `createUser`/signUp con `user_metadata` (`role: 'parent'`, `daycare_id`, `full_name`); marca `invitations` `accepted` + `accepted_at`; inserta `parent_children` (con manejo de UNIQUE). Verificar: script/curl que activa una invitación y confirma las 3 mutaciones en BD.
6. **`/activar-cuenta`** funcional (client, conserva el layout de SPEC 03): lee `code`, `email`, `child` de query params (prefill; `email` y `nombre` fijos/read-only); valida contraseña y checkbox de consentimiento (obligatorio, sin persistir); submit → `POST /api/activate`; errores visibles (código inválido/expirado, cuenta existente); éxito → `router.replace('/login?activated=1')`. Verificar en navegador con el link de un email real.
7. **Perfil con padres reales**: `app/kids/[id]/page.tsx` consulta `parent_children` (join `users`) como activos y `invitations` pending como pendientes del niño, y los pasa a `VincularPadreModalWrapper` como `linkedParents` (mapeo de parentesco a etiqueta UI). Verificar: tras activar, el padre aparece "Papá · activa" y las invitaciones pendientes "· invitación enviada".
8. **`/login`**: mostrar un aviso de éxito si el query param `activated=1` está presente. Verificar: tras activar, el redirect muestra el aviso.
9. `npm run build` y lint finales sin errores de tipos.

## Criterios de aceptación

- [ ] Existen enums `relationship_type` e `invitation_status`, y tablas `invitations` y `parent_children` con las columnas y relaciones del db-schema.
- [ ] Existe el trigger `handle_new_user` en `auth.users` y crea la fila `users` (role `parent`, `status` active) al registrarse un padre.
- [ ] RLS habilitado en `invitations` y `parent_children`; `get_advisors` (security) no reporta tablas sin RLS.
- [ ] La migración está aplicada en remoto y versionada en `supabase/migrations/`; existe el doc en `specs/database/`.
- [ ] `POST /api/invitations` con sesión staff crea la fila en `invitations` (pending, vigencia +7 días, `code`) y envía un email real con el código y el link de activación.
- [ ] Invitar al mismo email+niño con pending existente responde 409 y no crea una segunda fila ni reenvía.
- [ ] El modal muestra estado de carga al enviar, error visible si la invitación está duplicada, y éxito con auto-cierre (~2s); el código sigue visible hasta enviar.
- [ ] Con un código+email de una invitación real, `/activar-cuenta` crea la cuenta, la invitación pasa a `accepted` y existe la fila en `parent_children`.
- [ ] El campo EMAIL en `/activar-cuenta` es fijo (read-only) y viene del link.
- [ ] Código expirado o inválido muestra un error claro sin crear cuenta; email repetido (cuenta ya existente) muestra un error claro.
- [ ] El checkbox de consentimiento es obligatorio para activar.
- [ ] Tras activar, el redirect a `/login?activated=1` muestra el aviso "cuenta activada".
- [ ] El card PADRES VINCULADOS de `/kids/[id]` muestra padres reales: pendientes (invitations) y activos (parent_children → users) con el parentesco traducido (`mother` → "Mamá", `father` → "Papá", `guardian` → "Tutor/a"), y se refresca tras enviar una invitación.
- [ ] `npm run build` sin errores de tipos ni lint.

## Decisiones

- **Sí:** un solo spec para ambos extremos del flujo (invitar + activar). (Elegido por el usuario.)
- **Sí:** `POST /api/invitations` y `POST /api/activate` como API Routes de Next.js (Node). El email se lanza desde el lado de Next.js, no desde un Edge Function ni el cliente. (Elegido por el usuario.)
- **Sí:** Resend real siempre, con `RESEND_API_KEY`. Requiere dominio verificado para entregas a direcciones ajenas. (Elegido por el usuario.)
- **Sí:** confirmación de email de Supabase desactivada: el correo de invitación ES la verificación; el signup entra directo. (Elegido por el usuario.)
- **Sí:** trigger `AFTER INSERT` en `auth.users` (SECURITY DEFINER) para crear la fila `users` del padre desde `raw_user_meta_data`, como recomienda el db-schema. (Elegido por el usuario.)
- **Sí:** `POST /api/activate` usa la service role (`SUPABASE_SERVICE_ROLE_KEY`) para validar/aceptar la invitación e insertar `parent_children`, porque el padre recién creado no tiene sesión todavía.
- **Sí:** éxito en el modal = check + auto-cierre ~2s; el código sigue visible hasta enviar. (Elegido por el usuario.)
- **Sí:** EMAIL fijo/read-only en `/activar-cuenta` (viene del link). (Elegido por el usuario.)
- **Sí:** duplicado pending para el mismo email+niño → 409, no se re-invita. (Elegido por el usuario.)
- **Sí:** se leen padres reales en el card del perfil en este spec (cierra el loop verificable).
- **Sí:** el código lo genera el modal (cliente, `lib/invite.ts`) y el servidor lo valida contra el UNIQUE; si colisiona (improbable, ~1/33M), el servidor regenera y usa otro. El email siempre lleva el código guardado.
- **Sí:** el checkbox de consentimiento de fotos es obligatorio pero no se persiste (no hay columna para consentimiento parental en el esquema).
- **Sí:** tras activar, redirect a `/login?activated=1` con aviso (el feed del padre no existe aún).
- **No:** re-invitar/cancelar, reenvío, vincular cuenta existente, feed de familia, rate limiting, responsive.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Resend sin dominio verificado no entrega a direcciones reales | Prerrequisito explícito: dominio + `RESEND_API_KEY`; probar con el correo del propio usuario |
| Con confirmación de email desactivada cualquiera podría crear cuenta | La única vía de registro es `/activar-cuenta` con código de invitación válido; no hay signup público |
| Códigos de 5 caracteres son fuerza-bruteables | Aceptado; se valida por código+email+vigencia; rate limiting queda anotado como fuera de alcance |
| Colisión de `code` UNIQUE | Retry server-side con código regenerado |
| Trigger SECURITY DEFINER puede lanzar excepciones sobre `auth.users` | Guard en la función y meta mínima; se testea con una activación real en los criterios |
| El login genérico lleva al padre a `/` (feed staff) | Documentado y aceptado: el feed de familia es un spec futuro |

## Qué **no** está en este spec

- Feed / home de familia (`parent` → feed propio) y redirección por rol.
- Re-invitar, cancelar o reenviar invitaciones pendientes.
- Vincular una cuenta ya existente a la invitación.
- Desvincular / editar padres, avatars reales del padre.
- Rate limiting del endpoint de activación y emails transaccionales avanzados.
- Cada uno de esos, si llega, va en su propio spec.