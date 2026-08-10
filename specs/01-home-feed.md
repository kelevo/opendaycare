# Spec: 01 — Home Feed (Home /)

- **Estado**: Completada
- **Fecha**: 2026-08-09
- **Depende de**: Ninguna
- **Autor**: opencode

## Objetivos
- Reemplazar el starter de create-next-app por la pantalla de Feed como home (`/`).
- Lograr un resultado visualmente idéntico a `references/pantallas/feed.dc.html`.
- Mantener la app funcional sin autenticación y sin base de datos, usando datos estáticos de ejemplo.

## Alcance (Scope)
### Incluido
- `app/page.tsx` reescrito como la pantalla de feed.
- Fuentes Fredoka y Nunito vía `next/font/google`.
- Estilos globales base portados de la plantilla (`app/globals.css`).
- Metadatos y `lang="es"` (`app/layout.tsx`).
- Todos los SVGs e íconos copiados de la plantilla.

### Excluido
- Autenticación / sesión.
- Base de datos / datos dinámicos.
- Otras rutas (`/crear-publicacion`, `/ninos`, `/avisos`, `/mi-cuenta`, etc.).
- Adaptación responsive/móvil (solo escritorio, sidebar fija de 248px, como la plantilla).

## Diseño
### Referencia visual
`references/pantallas/feed.dc.html`

### Paleta y tipografía (de la plantilla)
| Token | Valor |
|---|---|
| Fondo página | `#F6ECDF` |
| Fondo superficie (cards/sidebar) | `#FFFDF9` |
| Borde | `#ECE0D0` |
| Texto primario | `#3F362E` |
| Texto secundario | `#94887B` |
| Texto tenue | `#A89A8B` |
| Cuerpo de post | `#4A4038` |
| Acento (active nav / corazón / logo) | `#D9583C`, `#E0654A`, `#C5503A`, gradiente `#F4977E→#EE8164` |
| Badge LOGRO | `#CFEBD8` bg / `#3E9B6C` dot+text |
| Badge ACTIVIDAD | `#C7E7F1` bg / `#2E89A6` dot+text |
| Badge ANUNCIO | `#CCD8F4` bg / `#4E72C8` dot+text |
| Avatar Mateo | `#A9D9E8` bg / `#1F7A93` text |
| Avatar Caro | `#F2937A` bg / blanco |

- Fuente base: `'Nunito', system-ui, sans-serif`.
- Títulos/acentos: `'Fredoka'` (font-weight 600).

## Estructura de la pantalla
1. **Sidebar** (`aside`, 248px, sticky, `height:100vh`, fondo `#FFFDF9`, borde derecho `#ECE0D0`):
   - Logo: caja 38x38 radius 12 con gradiente `#F8C3A8→#F2937A` + ícono sol; título "OpenDayCare" (Fredoka 17px) y subtítulo "Sala Soles".
   - Botón "Nueva publicación": gradiente `#F4977E→#EE8164`, texto blanco, sombra; link a `#`.
   - Nav: **Feed** (activo, fondo `#FBE3D8`, color `#D9583C`), **Niños**, **Avisos**, **Mi cuenta** (inactivos, color `#6E6359`); todos link a `#`.
   - Pie: avatar "C" (38px, círculo, `#F2937A`), "Caro Giménez" + "Maestra · Soles", botón logout (círculo 32px, ícono flecha) link a `#`.
2. **Main** (flex:1, scroll propio, `max-width:760px`, padding `34px 40px 80px`):
   - Header: label "GUARDERÍA · SALA SOLES" (`#D9583C`, letterspacing .8px), h1 "Buenas, Caro" (Fredoka 30px), sub "12 niños · martes 17 jun".
   - Composer box "Compartí un momento…" (card con avatar "C" y caja cámara `#FBE3D8`), link a `#`.
   - Divider "PUBLICADO HOY".
   - Posts (3):
     - **Logro** (Mateo, 14:20): badge LOGRO, "Para: familia de Mateo", texto orinal, footer con corazón 3, comentario 1, Editar.
     - **Actividad** (Mateo, 09:40): badge ACTIVIDAD, "Para: familia de Mateo", texto témperas, placeholder de foto (borde punteado `#DBCDBA`, altura 200px, "Foto · pintando con témperas"), footer corazón 5, comentario 2, Editar.
     - **Anuncio** (07:50): badge ANUNCIO, "Para: toda la sala", texto parque, footer corazón 8, comentario 0, Editar.

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| `GET /` | Render del feed con data estática (sidebar + main con 3 posts) |

## Criterios de aprobación
- [ ] `/` muestra el feed con sidebar y 3 posts (logro, actividad con foto, anuncio).
- [ ] Colores, tipografía (Nunito/Fredoka), badges e íconos idénticos a `feed.dc.html`.
- [ ] Sidebar: logo, botón "Nueva publicación", nav con Feed activo, perfil Caro con logout.
- [ ] Header "Buenas, Caro", composer "Compartí un momento…" y divider "PUBLICADO HOY" presentes.
- [ ] Sin auth ni datos dinámicos: todo es estático (no requiere login).
- [ ] Los links a pantallas inexistentes son `#` (no rompen la app).

## Decisiones
- Los estilos de la plantilla se portan **inline** (camelCase) en JSX para garantizar look idéntico; no se traduce a clases Tailwind.
- Links a pantallas inexistentes apuntan a `#` (placeholder) para evitar 404.
- Datos estáticos: usuario "Caro Giménez", niño "Mateo", fechas/horas del template.

## Archivos a modificar
- `app/page.tsx` — pantalla completa de feed.
- `app/globals.css` — base global (reset, fondo, fuente, scrollbar).
- `app/layout.tsx` — fuentes Fredoka/Nunito (CSS vars), `lang="es"`, metadata "OpenDayCare".

## Criterios de aceptación
- `npm run build` pasa sin errores de tipos/lint.
- Visualmente idéntico a `feed.dc.html`: colores, tipografía, espaciado, badges, íconos y layout de sidebar.
- La home `/` muestra el feed (no el starter de create-next-app).
