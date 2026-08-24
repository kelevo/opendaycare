# Spec: 04 — Modal Agregar niño en /kids

- **Estado**: Aprobado
- **Fecha**: 2026-08-13
- **Depende de**: SPEC 02
- **Autor**: opencode

## Objetivos
- Abrir el modal de `agregar-nino.dc.html` como overlay sobre `/kids` al clickear "Agregar niño", con validación frontend y máscara de fecha dd/mm/aaaa.

## Alcance (Scope)
### Incluido
- Overlay modal sobre `/kids`, fiel a `references/pantallas/agregar-nino.dc.html`.
- Campos: nombre completo (obligatorio), fecha de nacimiento (obligatorio, con máscara), sala (obligatorio, select con 4 salas fijas), alergias (opcional), notas médicas (opcional).
- 4 salas fijas en `lib/rooms.ts`: **Soles, Nubes, Estrellas, Arcoíris**.
- Validación frontend: Guardar deshabilitado hasta que los 3 obligatorios sean válidos + errores inline (borde rojo y mensaje) al interactuar; la fecha debe ser real.
- Al guardar: el niño se agrega a la grilla en memoria (estado React); card sin navegar (link `#`) y con badge de alergia si se ingresaron etiquetas.
- `app/kids/page.tsx` pasa a componente cliente (`'use client'`).

### Excluido
- Persistencia (localStorage / backend / BD) — el niño agregado se pierde al refrescar.
- Perfil `/kids/[slug]` para niños agregados (sigue siendo SSG de los 8 estáticos).
- Editar / eliminar niños. 
- Origen externo de las salas (queda hardcodeado por ahora).
- Validación server-side.
- Agrupación de la grilla por sala y cambios en el divider "SALA SOLES · N niños" (congelado de SPEC 02).
- Responsive/móvil.

## Diseño
### Referencia visual
`references/pantallas/agregar-nino.dc.html`

### Paleta
Overlay `rgba(63,54,46,.35)`; card `#FBF4EC` borde `#ECE0D0` radius 24, sombra `0 20px 50px -24px rgba(63,54,46,.35)`; inputs `#fff` borde `#EADFD0`; labels 12px 800 letterspacing .7px `#94887B`; títulos Fredoka; Guardar `#D9583C`, Cancelar `#94887B`; error borde `#D9583C` + mensaje `#C5503A` 13px.

### Estructura del modal (overlay)
1. Overlay `position:fixed inset:0`, centrado, click en "Cancelar" lo cierra.
2. Card `max-width:520px`:
   - **Header** (padding 20px 26px, borde inferior `#ECE0D0`): botón "Cancelar" (izquierda), título "Agregar niño" (Fredoka 600 18px, centro), botón "Guardar" (derecha, `#D9583C` 800, **deshabilitado hasta válido**).
   - **Body** (padding 24px 26px):
     - NOMBRE COMPLETO → input placeholder "Ej. Martina López".
     - Fila: FECHA DE NACIMIENTO (con máscara) + SALA (select `appearance:none` con chevron SVG, opciones de `lib/rooms`, vacío inicial con "Elegí sala").
     - ALERGIAS (ETIQUETAS) → input placeholder "Ej. Maní, Lactosa".
     - NOTAS MÉDICAS → textarea placeholder "Indicaciones, medicación, contactos…".
   - Errores inline debajo de cada campo inválido.

### Máscara de fecha
Solo dígitos; auto-inserta `/` tras el 2º y 5º dígito; máx 10 caracteres (`dd/mm/aaaa`).

### Validación (frontend)
- Nombre: no vacío (trim) → "Ingresá el nombre completo".
- Fecha: formato completo + fecha real del calendario (rechaza 31/02) → "Ingresá una fecha válida (dd/mm/aaaa)".
- Sala: elegir una de las 4 → "Elegí una sala".
- Guardar habilitado solo cuando los 3 obligatorios son válidos.
- Alergias y notas: opcionales.

### Card del niño agregado
- Inicial, nombre completo, "X años · 0 padres vinculados" (X calculado de la fecha), badge de alergia en mayúsculas si hay etiquetas, avatar por defecto `#A9D9E8`/`#1F7A93`, link `#`.

## Data model
`lib/rooms.ts` (nuevo):
```ts
export const rooms = ["Soles", "Nubes", "Estrellas", "Arcoíris"] as const;
```

`lib/kids.ts` (agrega):
```ts
export type KidInput = {
  name: string;
  birthday: string; // dd/mm/aaaa
  room: string;
  allergies?: string;
  medicalNotes?: string;
};

export function buildKidFromInput(input: KidInput): Kid;
```
- `buildKidFromInput` deriva: firstName/lastName (split del nombre), slug (slugify con acentos normalizados + sufijo numérico si colisiona con un slug existente), age (de la fecha), birthday en formato del template ("12 mar 2022"), room, enrollment `"—"`, avatar `#A9D9E8`/`#1F7A93`, allergy `{ label: MAYÚS, note: notas }` si allergies no vacío, needsLink `false`, linkedParents `[]`.

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| Click "Agregar niño" en `/kids` | Overlay del modal sobre la grilla |
| Click "Cancelar" | Modal se cierra sin cambios |
| Guardar con datos válidos | Modal se cierra; nueva card en la grilla (en memoria) |
| Guardar con datos inválidos | Botón deshabilitado + errores inline |

## Implementation plan
1. Crear `lib/rooms.ts` y agregar a `lib/kids.ts` el tipo `KidInput` + `buildKidFromInput` (+ slugify con colisión). Verificar: `npm run build`.
2. Modificar `components/kids/KidCard.tsx`: prop opcional `href` (default `/kids/[slug]`) para cards que no navegan. Verificar: build + `/kids` visualmente igual.
3. Crear `components/kids/AddKidModal.tsx` (`'use client'`): overlay, campos, máscara de fecha, validación (botón deshabilitado + errores inline), callback `onSave(kid: Kid)`, opciones de sala de `lib/rooms`.
4. Refactorizar `app/kids/page.tsx` a `'use client'`: estado `addedKids`, estado `showModal`, botón "Agregar niño" abre el modal, grilla renderiza `[...kids, ...addedKids]`, cards agregadas con `href="#"`. Verificar: build + flujo completo manual.

## Criterios de aceptación
- [ ] Click en "Agregar niño" abre el overlay sobre `/kids`, fiel a la referencia (header, campos y estilos).
- [ ] SALA muestra las 4 opciones (Soles, Nubes, Estrellas, Arcoíris) y arranca vacía.
- [ ] La fecha solo acepta dígitos y auto-inserta `/` (dd/mm/aaaa).
- [ ] Guardar deshabilitado hasta que nombre, fecha válida y sala estén completos.
- [ ] Errores inline con borde rojo en los campos inválidos.
- [ ] Al guardar válido el modal se cierra y aparece la card del nuevo niño (inicial, nombre, edad, "0 padres vinculados", badge de alergia si aplica, link `#`).
- [ ] "Cancelar" cierra el modal sin cambios.
- [ ] Al refrescar los niños agregados desaparecen (en memoria).
- [ ] Los 8 niños estáticos siguen navegando a su perfil.
- [ ] `npm run build` pasa sin errores de tipos ni lint.

## Decisiones
- **Sí:** overlay en `/kids` con estado local; primera pantalla con `'use client'` del proyecto. (Elegido por el usuario.)
- **Sí:** agregado en memoria (estado React), se pierde al refrescar. (Elegido por el usuario.)
- **Sí:** salas fijas Soles/Nubes/Estrellas/Arcoíris en `lib/rooms.ts` aparte, para reemplazarlas por un origen externo después. (Elegido por el usuario.)
- **Sí:** validación doble — Guardar deshabilitado hasta válido + errores inline. (Elegido por el usuario.)
- **Sí:** sala inicial vacía, el usuario elige. (Elegido por el usuario.)
- **Sí:** la card del agregado no navega (`href #`) porque el perfil es SSG estático.
- **Sí:** badge de alergia con etiquetas en mayúsculas, igual que el template. (Elegido por el usuario.)
- **Sí:** valores derivados por defecto (enrollment `"—"`, avatar `#A9D9E8`/`#1F7A93`) porque el modal no los captura.
- **No:** persistencia, perfil para agregados, editar/eliminar, agrupación por sala, backend.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Colisión de slugs/keys al agregar un niño cuyo nombre coincide con un estático | Sufijo numérico en `buildKidFromInput` |
| Refresco pierde los niños agregados | Comportamiento elegido (en memoria) |
| Select nativo rompe el look de la referencia | `appearance:none` + chevron SVG replican el estilo del template |
| Divider "SALA SOLES · N niños" no cuenta agregados y la grilla mezcla salas | Aceptado deliberadamente: divider congelado de SPEC 02; agrupación por sala → futuro spec |

## Qué NO está en este spec
- Persistencia de niños.
- Perfil de niños agregados.
- Editar / eliminar.
- Agrupación de grilla por sala.
- Origen externo de salas.
- Responsive.
