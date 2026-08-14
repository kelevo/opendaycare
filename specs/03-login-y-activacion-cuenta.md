# Spec: 03 — Login y activación de cuenta (/login, /activar-cuenta)

- **Estado**: Aprobado
- **Fecha**: 2026-08-13
- **Depende de**: SPEC 01
- **Autor**: opencode

## Objetivos
- Crear `/login` visualmente idéntico a `references/pantallas/login.dc.html` **sin** la sección "INGRESO COMO" (botones Personal/Familia).
- Crear `/activar-cuenta` visualmente idéntico a `references/pantallas/activar-cuenta.dc.html`.
- Mantener el patrón de SPEC 01/02: pantallas standalone, sin autenticación, sin base de datos, sin persistencia.

## Alcance (Scope)
### Incluido
- `app/login/page.tsx` — pantalla de login: hero izquierdo + formulario derecho, sin selectores de rol.
- `app/activar-cuenta/page.tsx` — pantalla de activación: logo, invitación "Mateo · Sala Soles", formulario (código, email, contraseña), consentimiento de fotos y botón de activación.
- Navegación: "Iniciar sesión" → `/`; "Activá tu cuenta" → `/activar-cuenta`; "Iniciar sesión" (en activar-cuenta) → `/login`; links a pantallas no implementadas → `#`.

### Excluido
- Botones Personal/Familia del login y toda la lógica de selección de rol del template.
- `familia-feed` y cualquier pantalla del lado familia (no existen todavía).
- Autenticación real, sesión, validación de formularios, manejo de errores.
- Cambios en `/` (sigue siendo el feed directo, sin redirect a `/login`).
- Adaptación responsive/móvil (solo escritorio, como SPEC 01/02).

## Diseño
### Referencia visual
`references/pantallas/login.dc.html` y `references/pantallas/activar-cuenta.dc.html`

### Paleta y tipografía
Distinta del feed (fondo `#F6ECDF`): estas pantallas usan fondo `#FBF4EC`, superficie blanca, borde `#EADFD0`, texto primario `#3F362E`, secundario `#94887B`, acento `#C5503A`, gradiente botones `#F4977E→#EE8164` con sombra `0 10px 22px -8px rgba(238,129,100,.7)`. Fuente base Nunito, títulos Fredoka (ya disponibles vía `next/font` de SPEC 01).

### Estructura de `/login`
1. **Panel izquierdo** (55% aprox, gradiente `linear-gradient(155deg,#F6A98E,#F2937A 45%,#EC7E62)`, texto blanco, padding `56px 60px`, columna space-between):
   - Círculos decorativos absolutos (`rgba(255,255,255,.12)` y `.10`).
   - Logo: caja 46px radius 14 `rgba(255,255,255,.22)` + ícono sol (SVG 26px) + "OpenDayCare" (Fredoka 600 21px).
   - H1 "El día de cada niño, compartido con su familia." (Fredoka 600 42px), p "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar." (17px, max-width 430px, `rgba(255,255,255,.92)`).
   - Pie: "🌿 Guardería Sala Soles" (14px, `rgba(255,255,255,.9)`).
2. **Panel derecho** (centrado, `max-width:392px`):
   - H2 "Iniciar sesión" (Fredoka 600 30px) + sub "Ingresá para ver el día de hoy." (15px `#94887B`).
   - **Sin** la etiqueta "INGRESO COMO" ni los botones Personal/Familia.
   - Label "EMAIL" (12px 700, letterspacing .7px, `#94887B`) + input email **prellenado** `caro@opendaycare.com` (padding 14px 16px, radius 14px, borde 1.5px `#EADFD0`, fondo `#fff`).
   - Label "CONTRASEÑA" + input password placeholder `••••••••`.
   - "¿Olvidaste tu contraseña?" alineado a la derecha (`#C5503A`, 13.5px, 700) → `#`.
   - Botón "Iniciar sesión" (gradiente, blanco 800 16px, radius 15px, sombra) → `/`.
   - "¿Te invitó la guardería? **Activá tu cuenta**" (`#C5503A`, 800) → `/activar-cuenta`.

### Estructura de `/activar-cuenta`
Centrada, `max-width:440px`, padding 40px:
1. Logo: caja 58px radius 18, gradiente `#F8C3A8→#F2937A`, sombra `0 12px 26px -10px rgba(238,129,100,.65)`, ícono sol 30px.
2. H1 "Bienvenida a OpenDayCare" (Fredoka 600 32px) + p "Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta." (15.5px `#94887B`).
3. Card de invitación (blanca, borde `#EADFD0`, radius 16): avatar 44px `#A9D9E8`/`#1F7A93` con "M", "Te invitaron a seguir a" (13px) y "Mateo · Sala Soles" (Fredoka 600 17px).
4. Formulario: label "CÓDIGO DE INVITACIÓN" + input `7K4P9` (Fredoka 700 18px, letterspacing 3px); label "EMAIL" + input `lucia.fernandez@gmail.com` (type email); label "CREAR CONTRASEÑA" + input password `contraseña`.
5. Consentimiento de fotos (fondo `#FBF1D6`, radius 14): checkbox 24px `#5FB97E` con check blanco + "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app." (14px `#8A7234`).
6. Botón "Activar mi cuenta" (gradiente, blanco 800 16px) → `#` (destino `familia-feed` no existe).
7. "¿Ya tenés cuenta? **Iniciar sesión**" (`#C5503A`, 800) → `/login`.

## Data model
Este spec no introduce ninguna estructura de datos: ambas pantallas son 100% estáticas (sin estado, sin componentes cliente, sin archivos en `lib/`).

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| `GET /login` | Login sin selectores de rol, email prellenado, "Iniciar sesión" → `/` |
| `GET /activar-cuenta` | Activación con invitación Mateo, "Activar mi cuenta" → `#` |

## Implementation plan
1. Crear `app/login/page.tsx` (server component estático): layout dos columnas con hero y formulario, sin la sección "INGRESO COMO". Verificar: `npm run build` y `/login` idéntico a `login.dc.html` salvo los botones de rol.
2. Crear `app/activar-cuenta/page.tsx` (server component estático). Verificar: `npm run build` y `/activar-cuenta` idéntico a `activar-cuenta.dc.html`.

## Criterios de aceptación
- [ ] `/login` es idéntico a `login.dc.html` salvo la sección "INGRESO COMO": no existen los botones Personal/Familia ni la etiqueta.
- [ ] El campo email del login viene prellenado con `caro@opendaycare.com`.
- [ ] "Iniciar sesión" navega a `/`; "¿Olvidaste tu contraseña?" → `#`; "Activá tu cuenta" → `/activar-cuenta`.
- [ ] `/activar-cuenta` es idéntico a `activar-cuenta.dc.html` (logo, invitación Mateo · Sala Soles, código `7K4P9`, email `lucia.fernandez@gmail.com`, checkbox de autorización marcado).
- [ ] "Activar mi cuenta" → `#`; "Iniciar sesión" → `/login`.
- [ ] `npm run build` pasa sin errores de tipos ni lint.
- [ ] `/` sigue mostrando el feed sin cambios (sin redirect a `/login`).

## Decisiones
- **Sí:** rutas `/login` y `/activar-cuenta` (sin prefijo `/auth`). (Elegido por el usuario.)
- **Sí:** se eliminan los botones Personal/Familia; al perder la selección de rol la pantalla queda estática y desaparece toda la lógica de estado del template (no hay componente cliente).
- **Sí:** "Iniciar sesión" → `/` (feed staff), coherente con el email prellenado de Caro. (Elegido por el usuario.)
- **Sí:** email prellenado `caro@opendaycare.com` (rol staff por defecto del template). (Elegido por el usuario.)
- **Sí:** links a pantallas sin implementar → `#` ("¿Olvidaste tu contraseña?" y "Activar mi cuenta", que en la referencia va a `familia-feed`). Igual que SPEC 01/02. (Elegido por el usuario.)
- **Sí:** pantallas standalone, sin redirect de `/` a `/login`. (Elegido por el usuario.)
- **No:** `familia-feed` y las pantallas del lado familia, ni autenticación real ni persistencia: cada una irá en su propio spec.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Divergencia visual con las referencias | Criterios de aceptación explícitos de paridad contra `login.dc.html` y `activar-cuenta.dc.html` |
| "Iniciar sesión" / "Activar mi cuenta" dependían de bindings `{{ }}` del template | Al ser estáticas, se reemplazan por links reales (`/`, `#`) — sin estado ni JS |

## Qué NO está en este spec
- Selector de rol (Personal/Familia) del login.
- `familia-feed` / pantallas del lado familia.
- Autenticación real, sesión, validación o errores de formulario.
- Redirect de `/` a `/login`.
- Versión móvil / responsive.
