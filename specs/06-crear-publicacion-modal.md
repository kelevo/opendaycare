# Spec: 06 — Modal Nueva publicación en sidebar

- **Estado**: Implemented
- **Fecha**: 2026-08-24
- **Depende de**: SPEC 02
- **Autor**: opencode

## Objetivos
- Crear un modal de nueva publicación (fiel a `references/pantallas/crear-publicacion.dc.html`) que se abre al clickear "Nueva publicación" en el sidebar principal, con selección múltiple de niños, tipos de publicación, descripción y placeholder de fotos.

## Alcance (Scope)
### Incluido
- Modal overlay sobre la página actual, idéntico a `crear-publicacion.dc.html`.
- Sección PARA: botones toggle de cada niño (avatar + nombre) + "Toda la sala"; selección múltiple.
- Sección TIPO: 7 botones de tipo — Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio.
- Sección DESCRIPCIÓN: textarea con placeholder "Contá cómo le fue hoy…".
- Sección FOTOS: placeholder visual (thumbnail mock + botón "Agregar").
- Botón "Publicar" estático → cierra el modal sin cambios.
- Botón "Cancelar" → cierra el modal.
- El modal recibe la lista de niños de `lib/kids.ts`.

### Excluido
- Persistencia de publicaciones (no se guarda nada).
- Publicación real al feed (la publicación no aparece en la lista).
- Upload real de fotos.
- Backend / base de datos.
- Responsive/móvil.
- Edición / eliminación de publicaciones.

## Diseño
### Referencia visual
`references/pantallas/crear-publicacion.dc.html`

### Paleta
Modal card `#FBF4EC` borde `#ECE0D0` radius 24, sombra `0 20px 50px -24px rgba(63,54,46,.35)`; overlay `rgba(63,54,46,.35)`; header borde inferior `#ECE0D0`; labels 12px 800 letterspacing .7px `#94887B`; inputs `#fff` borde `#EADFD0` radius 14; textarea `min-height:120px`; botón header "Cancelar" `#94887B` 700 15px; botón header "Publicar" `#D9583C` 800 15px; botones PARA: activo borde `#3F362E`/fondo `#3F362E`/texto `#fff`, inactivo borde `#ECE0D0`/fondo `#FFFDF9`/texto `#6E6359`; botones TIPO: cada uno con color propio (Comida `#9A7B1E`/`#fff`, Siesta `#E7DCF6`/`#7B5FC0`, Actividad `#2E89A6`/`#fff`, Logro `#CFEBD8`/`#3E9B6C`, Ánimo `#F9D2DE`/`#C56486`, Foto `#FBD8CC`/`#D9684A`, Anuncio `#CCD8F4`/`#4E72C8`); placeholder foto borde dashed `#DBCDBA`/fondo `#F4ECE1`/texto `#B0A290` con icono `#C5503A`.

### Estructura del modal (overlay)
1. Overlay `position:fixed inset:0` con fondo semitransparente, click fuera lo cierra.
2. Card `max-width:580px`, centrada:
   - **Header** (padding 20px 26px, borde inferior `#ECE0D0`):
     - Izquierda: "Cancelar" (`#94887B`, 700, 15px).
     - Centro: "Nueva publicación" (Fredoka 600, 18px, `#3F362E`).
     - Derecha: "Publicar" (`#D9583C`, 800, 15px).
   - **Body** (padding 24px 26px):
     - Label "PARA" → fila de botones toggle wrap: cada niño con avatar 26px (inicial Fredoka 13px) + nombre, + botón "Toda la sala". `margin-bottom:22px`.
     - Label "TIPO" → fila de 7 botones wrap con colores propios. `margin-bottom:22px`.
     - Label "DESCRIPCIÓN" → textarea placeholder "Contá cómo le fue hoy…", `min-height:120px`, `margin-bottom:22px`. Prellenado con texto de ejemplo: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón."
     - Label "FOTOS" → fila de thumbnails: 1 placeholder mock (icono cámara 26px, `#CBB89F`, fondo `#F4ECE1`) + 1 botón "Agregar" (borde dashed, icono +, texto "Agregar" `#C5503A`).

### Tipos de publicación (colores)
| Tipo | Fondo | Texto |
|---|---|---|
| Comida | `#9A7B1E` | `#fff` |
| Siesta | `#E7DCF6` | `#7B5FC0` |
| Actividad | `#2E89A6` | `#fff` |
| Logro | `#CFEBD8` | `#3E9B6C` |
| Ánimo | `#F9D2DE` | `#C56486` |
| Foto | `#FBD8CC` | `#D9684A` |
| Anuncio | `#CCD8F4` | `#4E72C8` |

## Data model
`lib/posts.ts` (nuevo):
```ts
export type PostType = "Comida" | "Siesta" | "Actividad" | "Logro" | "Ánimo" | "Foto" | "Anuncio";

export const postTypes: { key: PostType; bg: string; color: string }[] = [
  { key: "Comida", bg: "#9A7B1E", color: "#fff" },
  { key: "Siesta", bg: "#E7DCF6", color: "#7B5FC0" },
  { key: "Actividad", bg: "#2E89A6", color: "#fff" },
  { key: "Logro", bg: "#CFEBD8", color: "#3E9B6C" },
  { key: "Ánimo", bg: "#F9D2DE", color: "#C56486" },
  { key: "Foto", bg: "#FBD8CC", color: "#D9684A" },
  { key: "Anuncio", bg: "#CCD8F4", color: "#4E72C8" },
];
```

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| Click "Nueva publicación" en sidebar | Se abre el modal overlay |
| Click "Cancelar" o fuera del modal | Modal se cierra sin cambios |
| Click "Publicar" | Modal se cierra, sin cambios (estático) |

## Implementation plan
1. Crear `lib/posts.ts` con tipos `PostType` y array `postTypes`. Verificar: `npm run build`.
2. Crear `components/feed/CrearPublicacionModal.tsx` (`'use client'`): overlay, sección PARA (toggle múltiple + Toda la sala), TIPO (7 botones), DESCRIPCIÓN (textarea), FOTOS (placeholder), botones Cancelar/Publicar.
3. Modificar `components/layout/Sidebar.tsx`: convertir botón "Nueva publicación" a un componente cliente que abre el modal, o envolver en un wrapper `'use client'` similar a `VincularPadreModalWrapper`. La página principal sigue siendo server component.
4. Integrar el wrapper en `app/page.tsx` (home/feed) para que el sidebar pueda abrir el modal sobre la página.

## Criterios de aceptación
- [x] Click en "Nueva publicación" en sidebar abre el modal overlay, fiel a `crear-publicacion.dc.html`.
- [x] Header con "Cancelar", "Nueva publicación" y "Publicar" alineados correctamente.
- [x] Sección PARA muestra los 8 niños de `lib/kids.ts` con avatar + nombre, más botón "Toda la sala".
- [x] Se pueden seleccionar múltiples niños a la vez (toggle).
- [x] Sección TIPO muestra 7 botones con colores correctos (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio).
- [x] Sección DESCRIPCIÓN tiene textarea con placeholder "Contá cómo le fue hoy…".
- [x] Sección FOTOS muestra placeholder visual (thumbnail mock + botón "Agregar").
- [x] Botón "Cancelar" cierra el modal sin cambios.
- [x] Botón "Publicar" cierra el modal sin cambios (estático).
- [x] Click fuera del modal lo cierra sin cambios.
- [x] `npm run build` pasa sin errores de tipos ni lint.

## Decisiones
- **Sí:** modal overlay (no ruta nueva). Coherente con SPEC 04/05 (agregar niño y vincular padre son también modales).
- **Sí:** selección múltiple de niños (toggle). El usuario puede publicar para varios niños a la vez.
- **Sí:** "Publicar" es estático (no guarda publicación). Patrón consistente con SPEC 01-05 donde los botones son placeholders.
- **Sí:** fotos como placeholder visual. El upload real va en un spec futuro.
- **Sí:** textarea prellenada con texto de ejemplo (coherente con la referencia).
- **No:** persistencia de publicaciones, upload de fotos, backend.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El modal necesita `'use client'` por estado (selección, open/close) | Aislado en `CrearPublicacionModal.tsx`; sidebar o wrapper maneja estado |
| Divergencia visual con la referencia | Criterios de aceptación explícitos de paridad contra `crear-publicacion.dc.html` |
| 8 niños + "Toda la sala" pueden desbordar en viewport estrecho | `flex-wrap: wrap` en los botones, como la referencia |

## Qué NO está en este spec
- Persistencia de publicaciones.
- Publicación real al feed.
- Upload de fotos.
- Edición / eliminación de publicaciones.
- Responsive/móvil.
