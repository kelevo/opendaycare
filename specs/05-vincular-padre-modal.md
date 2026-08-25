# Spec: 05 — Modal Vincular padre en perfil de niño

- **Estado**: Implemented
- **Fecha**: 2026-08-24
- **Depende de**: SPEC 02
- **Autor**: opencode

## Objetivos
- Crear un modal de vinculación de padre (fiel a `references/pantallas/vincular-padre.dc.html`) que se abre al clickear "Vincular otro padre" en `/kids/[slug]`, con código de invitación dinámico y botón "Enviar invitación" estático.

## Alcance (Scope)
### Incluido
- Modal overlay sobre `/kids/[slug]`, idéntico a `vincular-padre.dc.html`.
- Campos: nombre del padre/madre (obligatorio), email (obligatorio), parentesco (botones: Mamá / Papá / Tutor/a).
- Código de invitación generado dinámicamente (5 caracteres alfanuméricos) al abrir el modal.
- Validación frontend: campos obligatorios completados + email con formato válido + parentesco seleccionado.
- Botón "Enviar invitación" estático → cierra el modal sin cambios (comportamiento estático).
- Botón "X" (cerrar) en el header → cierra el modal.

### Excluido
- Persistencia de padre vinculado (no se guarda el nuevo padre).
- Envío real de correo/invitación.
- Backend / base de datos.
- Pantalla de activación del padre invitado.
- Responsive/móvil.
- Edición / eliminación de padres ya vinculados.

## Diseño
### Referencia visual
`references/pantallas/vincular-padre.dc.html`

### Paleta
Modal card `#FBF4EC` borde `#ECE0D0` radius 24, sombra `0 20px 50px -24px rgba(63,54,46,.35)`; overlay `rgba(63,54,46,.35)`; header borde inferior `#ECE0D0`; labels 12px 800 letterspacing .7px `#94887B`; inputs `#fff` borde `#EADFD0` radius 14; botones de parentesco: activo borde `#9FB8EC`/fondo `#CCD8F4`/texto `#4E72C8`, inactivo borde `#ECE0D0`/fondo `#FFFDF9`/texto `#6E6359`; código de invitación caja `#FBF1D6` borde dashed `#E6D08A`, texto Fredoka 34px `#8A7234`; botón "Enviar invitación" gradiente `linear-gradient(180deg,#F4977E,#EE8164)` blanco 800 15.5px sombra `0 10px 22px -8px rgba(238,129,100,.7)`; alert info fondo `#E3ECFB` texto `#3F5694` icono `#4E72C8`.

### Estructura del modal (overlay)
1. Overlay `position:fixed inset:0` con fondo semitransparente, click fuera lo cierra.
2. Card `max-width:480px`, centrada:
   - **Header** (padding 20px 26px, borde inferior `#ECE0D0`):
     - Izquierda: título "Vincular padre" (Fredoka 600 18px `#3F362E`) + sub "a {nombre del niño}" (13px `#A89A8B`).
     - Derecha: botón "X" (cuadrado 34px radius 10, fondo `#F0E6D8`, color `#94887B`, icono cruz SVG).
   - **Body** (padding 22px 26px):
     - Alerta informativa: fondo `#E3ECFB` borde `#CCD8F4` radius 14, padding 13px 16px, icono info SVG 20px `#4E72C8`, texto 13.5px `#3F5694`: "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {nombre}."
     - Label "NOMBRE DEL PADRE/MADRE" → input placeholder "Ej. Diego Fernández" (margin-bottom 18px).
     - Label "EMAIL" → input type="email" placeholder "correo@ejemplo.com" (margin-bottom 18px).
     - Label "PARENTESCO" → 3 botones flex (Mamá / Papá / Tutor/a) gap 9px, margin-bottom 20px.
     - Caja de código de invitación: fondo `#FBF1D6`, borde dashed `#E6D08A` radius 16, padding 18px, centrado:
       - Label "CÓDIGO DE INVITACIÓN" (12px 800 letterspacing .7px `#A88526`).
       - Código en Fredoka 600 34px letterspacing 7px `#8A7234` (ej. "7K4P9").
       - "Vence en 7 días" (13px `#A88526`, margin-top 6px).
     - Botón "Enviar invitación" (ancho completo, gradiente, icono SVG de flecha/papel).

### Generación de código de invitación
- 5 caracteres alfanuméricos en mayúsculas, generados al abrir el modal.
- Función pura `generateInviteCode(): string` en un archivo util.
- Formato: mezcla de letras (A-Z) y dígitos (0-9), sin caracteres ambiguos (I, O, 0, 1 excluidos).

### Extensión del tipo ParentLink
- `ParentLink.role` pasa de `"Mamá" | "Papá"` a `"Mamá" | "Papá" | "Tutor/a"`.

## Data model
`lib/kids.ts` (modificación):
```ts
export type ParentLink = {
  id: string;
  name: string;
  role: "Mamá" | "Papá" | "Tutor/a";  // agregado "Tutor/a"
  status: "active" | "pending";
};
```

`lib/invite.ts` (nuevo):
```ts
export function generateInviteCode(): string;
```
- 5 chars, alfanuméricos mayúsculas, excluye I, O, 0, 1.

## Entradas / Salidas
| Entrada | Salida |
|---|---|
| Click "Vincular otro padre" en `/kids/[slug]` | Se abre el modal overlay |
| Click botón "X" o fuera del modal | Modal se cierra, vuelve al perfil |
| Click "Enviar invitación" | Modal se cierra, sin cambios (estático) |

## Implementation plan
1. Crear `lib/invite.ts` con `generateInviteCode()`. Verificar: `npm run build`.
2. Modificar `lib/kids.ts`: extender `ParentLink.role` para incluir `"Tutor/a"`. Verificar: `npm run build`.
3. Crear `components/kids/VincularPadreModal.tsx` (`'use client'`): overlay, campos, parentesco toggle, código generado al montar, validación, botón cerrar.
4. Modificar `app/kids/[slug]/page.tsx`: agregar botón "Vincular otro padre" (si no existe ya como `#`) que abre el modal con el nombre del niño como contexto.

## Criterios de aceptación
- [x] Click en "Vincular otro padre" en `/kids/[slug]` abre el modal overlay centrado, fiel a `vincular-padre.dc.html`.
- [x] El header muestra "Vincular padre" y "a {nombre del niño}" (el nombre real del perfil).
- [x] Botón "X" cierra el modal sin cambios.
- [x] Click fuera del modal lo cierra sin cambios.
- [x] Alerta informativa con fondo azul claro y texto sobre el correo con código.
- [x] Campos NOMBRE DEL PADRE/MADRE y EMAIL con placeholders correctos.
- [x] Parentesco muestra 3 botones: Mamá, Papá, Tutor/a; uno activo por defecto (Mamá).
- [x] Código de invitación tiene 5 caracteres alfanuméricos en mayúsculas, letras Fredoka.
- [x] Código dice "Vence en 7 días".
- [x] Cada vez que se abre el modal, se genera un código nuevo.
- [x] Botón "Enviar invitación" cierra el modal sin cambios (estático).
- [x] `npm run build` pasa sin errores de tipos ni lint.

## Decisiones
- **Sí:** modal overlay (no ruta nueva). Coherente con SPEC 04 (agregar niño es también un modal).
- **Sí:** código de invitación generado dinámicamente (no hardcodeado como la referencia), para que sea realista. Generación pura sin estado.
- **Sí:** "Enviar invitación" es estático (no envía correo, no guarda padre). Patrón consistente con SPEC 01/02/03/04 donde los botones son placeholders.
- **Sí:** rol "Tutor/a" agregado al tipo `ParentLink`. La referencia incluye este tercer botón.
- **Sí:** 5 caracteres alfanuméricos, excluyendo I, O, 0, 1 (confusión visual).
- **No:** persistencia de padres, envío real de emails, backend.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El modal necesita `'use client'` por estado (campos, código) | Aislado en `VincularPadreModal.tsx`; la página perfil sigue siendo server component |
| Divergencia visual con la referencia | Criterios de aceptación explícitos de paridad contra `vincular-padre.dc.html` |
| `generateInviteCode` podría repetir códigos | Aceptado: para mocks estáticos la colisión es extremadamente improbable (~1/33M) |

## Qué NO está en este spec
- Persistencia del padre vinculado.
- Envío real de correo de invitación.
- Activación de cuenta del padre invitado.
- Edición / eliminación de padres ya vinculados.
- Responsive/móvil.
