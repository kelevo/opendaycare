# Spec: 02 — Kids y perfil de niño (/kids)

- **Estado**: Aprobada
- **Fecha**: 2026-08-09
- **Depende de**: SPEC 01
- **Autor**: opencode

## Objetivos
- Crear la vista de niños (`/kids`) y el perfil de niño (`/kids/[slug]`) visualmente idénticos a `references/pantallas/ninos.dc.html` y `references/pantallas/perfil-nino.dc.html`.
- Extraer el sidebar a un componente compartido con navegación real (logo y Feed → `/`, Niños → `/kids`) y refactorizar el feed para usarlo.
- Mantener el patrón de SPEC 01: sin autenticación ni base de datos, con data estática tipada.

## Alcance (Scope)
### Incluido
- `app/kids/page.tsx` — pantalla Niños: header, buscador, divider de sala y grilla de 8 niños.
- `app/kids/[slug]/page.tsx` — pantalla Perfil de niño, con `generateStaticParams()` y `notFound()` para slugs inexistentes.
- `lib/kids.ts` — tipo `Kid` y data estática de los 8 niños del template.
- `components/layout/Sidebar.tsx` — sidebar compartido con estado activo según ruta.
- `components/kids/KidCard.tsx` — card de la grilla de niños.
- Refactor de `app/page.tsx` para consumir `Sidebar` (active="feed") en vez del aside inline.
- Navegación actualizada: logo y Feed → `/`; Niños → `/kids`; el resto (Avisos, Mi cuenta, Nueva publicación, logout) → `#`.

### Excluido
- Pantalla agregar/editar niño (`agregar-nino.dc.html`).
- Pantalla vincular padre (`vincular-padre.dc.html`).
- Pantalla resumen del día (`resumen-dia.dc.html`).
- Buscador funcional (solo visual, sin estado ni filtrado).
- Adaptación responsive/móvil (solo escritorio, sidebar fija de 248px, como SPEC 01).
- Autenticación / base de datos / persistencia.

## Diseño
### Referencia visual
`references/pantallas/ninos.dc.html` y `references/pantallas/perfil-nino.dc.html`

### Paleta y tipografía
Misma que SPEC 01: fondo `#F6ECDF`, superficie `#FFFDF9`, borde `#ECE0D0`, texto primario `#3F362E`, secundario `#94887B`, tenue `#A89A8B`, acento `#D9583C`/`#C5503A`, gradiente botones `#F4977E→#EE8164`. Fuente base Nunito, títulos Fredoka.

### Estructura de la pantalla Niños
1. **Sidebar** (compartido): item "Niños" activo (fondo `#FBE3D8`, color `#D9583C`), Feed inactivo.
2. **Main** (`max-width:880px`, padding `34px 40px 80px`):
   - Header: label "GESTIÓN" (`#D9583C`, letterspacing .8px), h1 "Niños" (Fredoka 30px), botón "Agregar niño" (gradiente) link a `#`.
   - Buscador: caja con ícono lupa e input "Buscar niño…" (solo visual).
   - Divider: "SALA SOLES" · "8 niños".
   - Grilla `grid-template-columns:repeat(2,1fr)`, gap 14, con 8 `KidCard`.

### KidCard (componente)
- Avatar circular 48px con inicial (`Fredoka`, 19px), colores por niño.
- Nombre completo (Fredoka 16px), sub "3 años · 2 padres vinculados".
- Badge si aplica: `allergy.label` → fondo `#FBD8CC`/texto `#D9684A` (MANÍ, LACTOSA); `needsLink` → fondo `#F9D2DE`/texto `#C56486` (VINCULAR); si no, chevron `#CBB89F`.
- Link a `/kids/[slug]`.

### Estructura de la pantalla Perfil de niño
1. **Sidebar** (compartido): item "Niños" activo.
2. **Main** (`max-width:820px`):
   - Link "Volver a Niños" → `/kids`.
   - Header: avatar 84px con inicial, h1 nombre completo, "3 años · Sala Soles", botón "Editar" (borde `#ECE0D0`) link a `#`.
   - Bloque alergias/notas (fondo `#FBDAD6`, ícono alerta): solo se renderiza si `kid.allergy` existe.
   - Card datos: filas "Fecha de nacimiento" → `kid.birthday`, "Sala" → `kid.room`, "Ingreso" → `kid.enrollment`.
   - Columna derecha (300px): botón "Resumen del día" (fondo `#3F362E`, texto blanco) link a `#`; card "PADRES VINCULADOS" con cada `linkedParents` (avatar 40px con inicial, nombre, "Mamá · activa", badge `ACTIVA` fondo `#CFEBD8`/texto `#3E9B6C` o `PENDIENTE` fondo `#F7E7A6`/texto `#9A7B1E`) y link "Vincular otro padre" → `#`.

## Data model
`lib/kids.ts`:

```ts
export type ParentLink = {
  id: string;
  name: string;
  role: "Mamá" | "Papá";
  status: "active" | "pending";
};

export type Kid = {
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;   // formato del template: "12 mar 2022"
  room: string;       // "Soles"
  enrollment: string; // "feb 2025"
  avatarBg: string;
  avatarColor: string;
  allergy?: { label: "MANÍ" | "LACTOSA"; note: string };
  needsLink?: boolean; // true → badge VINCULAR
  linkedParents: ParentLink[];
};

export const kids: Kid[]; // 8 niños, mismo orden del template
export function getKidBySlug(slug: string): Kid | undefined;
```

- Slugs explícitos: `mateo-fernandez`, `sofia-mendez`, `benjamin-ruiz`, `valentina-soto`, `tomas-diaz`, `emma-castro`, `lucas-romero`, `olivia-vega`.
- Avatar: inicial = `firstName[0]`. Colores del template: Mateo `#A9D9E8`/`#1F7A93`; Sofía y Emma `#F4B8CC`/`#C44A7A`; Benjamín y Olivia `#B9DEC4`/`#3E8B62`; Valentina `#F4DC8E`/`#9A7B1E`; Tomás `#C9B6E8`/`#7B5FC0`; Lucas `#A9D9E8`/`#1F7A93`.
- Badges del template: Mateo → `allergy` MANÍ; Tomás → `allergy` LACTOSA; Valentina → `needsLink`; el resto sin badge.
- Mateo con datos exactos del template: cumpleaños "12 mar 2022", ingreso "feb 2025", alergia "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.", padres Lucía Fernández (Mamá · activa) y Diego Fernández (Papá · invitación enviada → pendiente). Para los otros 7, data mock coherente con su badge y el conteo de padres del template.

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| `GET /kids` | Grilla de 8 niños con sidebar (Niños activo) |
| `GET /kids/[slug]` | Perfil del niño, o 404 si el slug no existe |
| `GET /` | Feed (refactorizado, con Sidebar compartido) |

## Implementation plan
1. Crear `lib/kids.ts` con el tipo `Kid` y los 8 niños (Mateo idéntico al template; el resto mock consistente). Verificar: `npm run build`.
2. Crear `components/layout/Sidebar.tsx` con prop `active: "feed" | "kids"`; links logo y Feed → `/`, Niños → `/kids`, Avisos/Mi cuenta/Nueva publicación/logout → `#`. Verificar: build + preview.
3. Refactorizar `app/page.tsx` para renderizar `Sidebar active="feed"` y eliminar el aside inline. Verificar: `/` queda visualmente idéntico al feed actual.
4. Crear `components/kids/KidCard.tsx` (card con badge condicional y link a `/kids/[slug]`).
5. Crear `app/kids/page.tsx` con sidebar (active="kids"), header, buscador visual, divider y grilla de 8 `KidCard`. Verificar: `/kids` idéntico a `ninos.dc.html`.
6. Crear `app/kids/[slug]/page.tsx` con `generateStaticParams()` (los 8 slugs), `params: Promise<{ slug: string }>`, `notFound()` si `getKidBySlug` no devuelve nada, y las secciones del perfil. Verificar: los 8 slugs renderizan; un slug inventado → 404.

## Criterios de aceptación
- [ ] `/kids` muestra los 8 niños del template con iniciales, colores, edades, conteo de padres y badges MANÍ/LACTOSA/VINCULAR exactos.
- [ ] `npm run build` pasa sin errores de tipos ni lint.
- [ ] `/kids/mateo-fernandez` muestra los datos exactos del template (alergias, fechas, padres Lucía/Diego con badges ACTIVA/PENDIENTE).
- [ ] Cualquier otro de los 8 slugs renderiza su perfil con nombre, edad, sala, datos y padres correspondientes.
- [ ] Un slug inexistente (ej. `/kids/pepe-arbolito`) → 404 de Next.
- [ ] Sidebar compartido: "Niños" activo en `/kids` y `/kids/[slug]`; "Feed" activo en `/`; los links Feed→`/` y Niños→`/kids` navegan correctamente.
- [ ] `/` (feed) se ve idéntico tras el refactor del Sidebar.

## Decisiones
- **Sí:** sidebar como componente compartido (`components/layout/Sidebar.tsx`) con refactor del feed. Evita triplicar ~200 líneas y centraliza la navegación. (Elegido por el usuario.)
- **Sí:** data estática tipada en `lib/kids.ts`. Descartado `data/kids.ts` y datos hardcodeados en cada página (riesgo de divergencia lista/perfil).
- **Sí:** slugs explícitos en la data. Descartado slugify automático por nombre (los nombres tienen acentos; un campo fijo es estable y predecible).
- **Sí:** buscador solo visual. Descartado filtrado funcional por requerir componente cliente ('use client'), lo que rompe el patrón estático de SPEC 01.
- **Sí:** `notFound()` para slugs desconocidos. Descartado `redirect('/kids')` (más código, menos semántico).
- **Sí:** links a pantallas inexistentes (Avisos, Mi cuenta, Agregar niño, Editar, Vincular padre, Resumen del día) apuntan a `#`, como en SPEC 01.
- **No:** agregar/editar niño, vincular padre y resumen del día quedan fuera; cada uno irá en su propio spec.
- Nota: definición rápida sin aclaraciones extensas; las 5 decisiones estructurales se confirmaron por el usuario en la fase de preguntas.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Refactor del feed altera el visual actual | Criterio de aceptación explícito: `/` idéntico; se compara contra la referencia `feed.dc.html` |
| `params` es `Promise` en Next 16 (cambio respecto a versiones previas) | En `[slug]/page.tsx` se hace `await params` y se tipa `params: Promise<{ slug: string }>`; verificado en docs locales de `node_modules/next/dist/docs` |
| Divergencia entre la grilla y el perfil si un niño cambia | Un solo fuente de verdad (`lib/kids.ts`) usado por ambas pantallas |

## Qué NO está en este spec
- Agregar / editar niño (`/kids/[slug]/edit` no existe).
- Vincular padre.
- Resumen del día.
- Buscador funcional.
- Versión móvil / responsive.
- Autenticación o base de datos.

Cada uno de esos, si llega, va en su propio spec.
