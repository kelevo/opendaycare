# Spec: 07 — Autenticación con Supabase (login) y protección de rutas

- **Estado**: Approved
- **Fecha**: 2026-09-05
- **Depende de**: SPEC 03
- **Autor**: opencode

## Objetivos
- Conectar `/login` (diseño ya construido en SPEC 03) a la autenticación real de Supabase con email y contraseña, redirigiendo al feed `/` tras un login exitoso.
- Proteger las rutas de la aplicación vía middleware: todo salvo `/login` y `/activar-cuenta` requiere sesión; los usuarios autenticados que visiten `/login` o `/activar-cuenta` son redirigidos a `/`.
- Incluir un cierre de sesión (logout) básico y mostrar el usuario logueado en el feed (`/`).

## Alcance (Scope)
### Incluido
- `proxy.ts` (raíz) — protección de rutas usando el patrón de Supabase SSR (context7): envuelve `updateSession` de `lib/supabase/proxy.ts`, redirige a `/login` las rutas protegidas sin sesión y a `/` las públicas con sesión. (Next 16 depreca `middleware.ts` en favor de `proxy.ts`.)
- `lib/supabase/proxy.ts` (modificar) — `updateSession` pasa a devolver `{ supabaseResponse, user }` además de refrescar la sesión.
- `/login` funcional: `app/login/page.tsx` pasa a ser componente cliente con form real email+password, manejo de error genérico (credenciales inválidas) y redirección a `/` tras el submit exitoso. Diseño visual idéntico al de SPEC 03 (sin rediseño).
- `/activar-cuenta`: sin lógica de activación en este spec; la redirección con sesión la maneja el middleware.
- Logout: acción `signOut()` y redirección a `/login`.
- Mostrar el usuario logueado (nombre + avatar) en `/`, leído con `supabase.auth.getUser()` + tabla `users`.

### Excluido
- **Activación de cuenta por código de invitación** (`/activar-cuenta` queda estático, sin lógica real). Va en un spec futuro.
- Selección de rol (Personal/Familia) — no existe (desde SPEC 03).
- Autorización por rol: tras el login no se consulta `role`; cualquier login válido → `/`.
- Redirección por rol (`parent` → `familia-feed`): `familia-feed` no existe.
- Registro de cuenta / sign-up / "¿Olvidaste tu contraseña?" (sigue siendo `#`).
- Tabla `invitations` (no se crea en este spec).
- Responsive/móvil.

## Diseño
### Referencia visual
El diseño ya existe de SPEC 03: `references/pantallas/login.dc.html`. No se modifica el layout del login (hero izquierdo + formulario derecho). Los inputs de email/contraseña se vuelven controlados y funcionales.

### Estructura de `/login` (funcional)
- Igual al de SPEC 03: hero izquierdo con logo, H1 y pie; panel derecho con título "Iniciar sesión", labeled "EMAIL" y "CONTRASEÑA", link "¿Olvidaste tu contraseña?" → `#`, botón "Iniciar sesión", link "¿Te invitó la guardería? Activá tu cuenta" → `/activar-cuenta`.
- El email ya **no viene prellenado** (login real): input vacío de tipo email, required.
- Mensaje de error genérico en rojo (`#C5503A`) bajo el formulario cuando las credenciales son inválidas.
- Estados durante el submit (botón deshabilitado / "Ingresando…").

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| `GET /` sin sesión | Redirect 307 → `/login` |
| `GET /kids`, `GET /kids/[slug]` sin sesión | Redirect 307 → `/login` |
| `GET /login` sin sesión | Login renderizado |
| `GET /login` con sesión | Redirect 307 → `/` (manejado por middleware) |
| `GET /activar-cuenta` con sesión | Redirect 307 → `/` (manejado por middleware) |
| Login con email+password válidos | Redirect 307 → `/` |
| Login con credenciales inválidas | Mensaje de error en el formulario |
| Logout | `signOut()` → Redirect → `/login` |

## Implementation plan
1. **Modificar `lib/supabase/proxy.ts`**: `updateSession` devuelve `{ supabaseResponse, user }` (refresca sesión con `getUser()` y expone el usuario).
2. **Completar `proxy.ts`** en la raíz (patrón context7 / convención de Next 16): envuelve `updateSession`, redirige a `/` si hay sesión en rutas públicas (`/login`, `/activar-cuenta`) y a `/login` si no hay sesión en rutas protegidas. Configurar `matcher` excluyendo estáticos (`_next/static`, `_next/image`, favicon, archivos de imagen). Verificar: `npm run build` y que `/` sin sesión redirija a `/login`.
3. **Convertir `app/login/page.tsx` a componente cliente** (`'use client'`): form controlado email+password, submit llama a `supabase.auth.signInWithPassword`, en éxito `router.replace('/')`, en fallo muestra error genérico. La redirección por sesión la maneja el middleware. Verificar: login con credenciales reales contra Supabase.
4. Mostrar usuario logueado en `/`: en `app/page.tsx` (server component) leer `supabase.auth.getUser()` + tabla `users` para nombre/avatar. Renderizar nombre (y avatar si existe) en el área de perfil. Verificar: el nombre del usuario logueado aparece en `/`.
5. **Crear componente cliente de logout** (patrón `SidebarNewPostButton.tsx`): botón que llama a `supabase.auth.signOut()` y `router.push('/login')`. Integrarlo en `components/layout/Sidebar.tsx`. Verificar: logout redirige a `/login` y `/` queda protegido.
6. `npm run build` final sin errores de tipos ni lint.

## Criterios de aceptación
- [ ] `lib/supabase/proxy.ts` expone `updateSession` devolviendo `{ supabaseResponse, user }`.
- [ ] Existe `proxy.ts` (raíz) que protege todas las rutas salvo `/login` y `/activar-cuenta`, con `matcher` que excluye estáticos/imágenes/favicon.
- [ ] `GET /` sin sesión redirige a `/login`.
- [ ] `GET /kids` y `GET /kids/[slug]` sin sesión redirigen a `/login`.
- [ ] `GET /login` sin sesión muestra el login (diseño idéntico al de SPEC 03).
- [ ] `GET /login` con sesión redirige a `/`.
- [ ] `GET /activar-cuenta` con sesión redirige a `/`.
- [ ] Login con email+password válidos contra Supabase redirige a `/`.
- [ ] Login con credenciales inválidas muestra un mensaje de error genérico en el formulario (sin layout roto).
- [ ] La página `/` muestra el nombre (y avatar si existe) del usuario logueado.
- [ ] Logout cierra la sesión y redirige a `/login`; `/` vuelve a estar protegido.
- [ ] `npm run build` pasa sin errores de tipos ni lint.

## Decisiones
- **Sí:** protección por middleware con lista de excepción `/login` y `/activar-cuenta`; todo lo demás requiere sesión. Patrón estándar de Supabase SSR confirmado con context7. (Elegido por el usuario.)
- **Sí:** se modifica `lib/supabase/proxy.ts` para que `updateSession` devuelva el usuario; el middleware decide el redirect centralizadamente (evita duplicar la lógica de cookies y de redirección por página). (Recomendado por context7.)
- **Sí:** la protección de rutas se implementa en el `proxy.ts` de la raíz existente (convención de Next 16); `middleware.ts` queda deprecado. (Elegido por el usuario durante la implementación.)
- **Sí:** `/login` y `/activar-cuenta` redirigen a `/` si ya hay sesión (manejado por middleware). (Elegido por el usuario.)
- **Sí:** flujo genérico de login: cualquier email+password válido → `/`, sin consultar `role`. (Elegido por el usuario.)
- **Sí:** mensaje de error genérico en el formulario de login para credenciales inválidas. (Elegido por el usuario.)
- **Sí:** se incluye logout básico en este spec. (Elegido por el usuario.)
- **Sí:** se muestra el usuario logueado en `/`. (Elegido por el usuario.)
- **Sí:** se reutiliza el diseño visual exacto del login de SPEC 03; solo se conecta a Supabase. (Elegido por el usuario.)
- **No:** la activación de cuenta por código de invitación (queda fuera; va en un spec futuro).
- **No:** autorización por rol, redirección por rol, registro/sign-up, tabla `invitations`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Middleware sin `matcher` correcto bloquea assets estáticos | `matcher` excluye `_next/static`, `_next/image`, `favicon.ico` y archivos de imagen (patrón context7) |
| Duplicar la lógica de cookies en middleware y `proxy.ts` | Modificar `proxy.ts` para devolver `{ supabaseResponse, user }` y envolverlo desde el middleware |
| El login pasa a componente cliente: loss de SSR del hero | Mantener el layout intacto; solo el form/estado es cliente |
| Redirección de `/login` con sesión y del post-login pueden entrar en loop | `router.replace('/')` (no push) y validar una sola vez |

## Qué NO está en este spec
- Activación de cuenta por código de invitación (`/activar-cuenta` queda estático).
- Autorización / redirección por rol (`parent` → `familia-feed`).
- Registro de cuenta, "¿Olvidaste tu contraseña?" funcional.
- Tabla `invitations` y su RLS.
- Responsive/móvil.
