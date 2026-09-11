## Context

La aplicación actual tiene una estructura plana con un sidebar compartido para todos los usuarios. El proxy.ts ya existe y maneja autenticación básica (redirect a `/login` si no hay sesión). No hay protección por roles ni separación de paneles.

El proyecto usa Next.js 16 con App Router, donde `middleware.ts` se renombró a `proxy.ts`. El proxy actual usa `lib/supabase/proxy.ts` para manejar sesiones con Supabase SSR.

## Goals / Non-Goals

**Goals:**
- Separar la experiencia de usuario entre staff y familia
- Proteger rutas por rol vía proxy.ts
- Crear layouts independientes para cada panel
- Mantener el sidebar como componente único con renderizado condicional

**Non-Goals:**
- Crear apps separadas o subdominios distintos
- Modificar el esquema de base de datos existente
- Agregar nuevos roles al sistema
- Implementar funcionalidades nuevas (solo reorganizar las existentes)

## Decisions

### 1. Estructura de rutas: `/staff/*` y `/family/*`

**Decisión:** Usar prefijos de ruta separados para cada panel.

**Alternativas consideradas:**
- Rutas compartidas con query params (`/?panel=staff`) — rechazado porque dificulta la protección de rutas y la semántica de URLs
- Subdominios (`staff.opendaycare.com`) — rechazado porque añade complejidad de infraestructura innecesaria

**Razón:** Las rutas limpias permiten protección simple en proxy.ts, son semánticamente claras y facilitan la evolución independiente de cada panel.

### 2. Proxy.ts: lógica de roles inline

**Decisión:** Agregar la lógica de protección por roles directamente en `proxy.ts` (raíz), consultando el rol del usuario desde la tabla `users`.

**Alternativas consideradas:**
- Middleware separado por rol — rechazado porque añade complejidad sin beneficio
- Protección en layouts — rechazado porque no previene la carga inicial de la página

**Razón:** El proxy ya tiene acceso a la sesión del usuario. Agregar una consulta más a `users` para obtener el rol es eficiente y centraliza toda la lógica de protección.

### 3. Sidebar: componente único con prop `role`

**Decisión:** Mantener un solo componente `Sidebar` que reciba `role` y renderice condicionalmente.

**Alternativas consideradas:**
- Dos componentes separados (`StaffSidebar`, `FamilySidebar`) — rechazado porque crea duplicación de código de presentación
- Componente con children — rechazado porque complica la API innecesariamente

**Razón:** La presentación visual es idéntica (colores, tipografía, estructura). Solo difieren los items de navegación y la presencia del botón de nueva publicación. Un prop `role` es suficiente.

### 4. Layouts por panel

**Decisión:** Crear `app/staff/layout.tsx` y `app/family/layout.tsx` como server components que verifiquen auth y rol.

**Razón:** Los layouts de Next.js App Router se renderizan en el servidor, lo que permite verificar permisos antes de renderizar cualquier contenido. Cada layout provee su propio Sidebar con la configuración correcta.

### 5. Página raíz como redirect

**Decisión:** `app/page.tsx` se convierte en un server component que redirige a `/staff` o `/family` según el rol.

**Razón:** Evita mostrar contenido inapropiado antes de la redirección. Es más seguro que un redirect client-side.

## Risks / Trade-offs

### [Riesgo] Performance del proxy
**Impacto:** Cada request agora una consulta adicional a `users` para obtener el rol.
**Mitigación:** La consulta es simple (SELECT un campo por UUID) y puede cachearse en el proxy response. En el futuro se puede agregar el rol al JWT de Supabase.

### [Riesgo] Hardcoded data en feed
**Impacto:** El feed actual tiene datos hardcodeados. El feed familiar necesita datos reales de la DB.
**Mitigación:** Implementar primero el proxy y layouts, luego conectar el feed a la DB en un cambio separado.

### [Riesgo] Rutas huérfanas
**Impacto:** Al mover `app/kids/` a `app/staff/kids/`, las rutas viejas quedan huérfanas.
**Mitigación:** Eliminar `app/kids/` completamente después de la migración.

### [Trade-off] Seguridad vs Performance
**Decisión:** Verificar rol en cada request del proxy (más seguro) en vez de cachear en cookie (más rápido).
**Razón:** Para una app con pocos usuarios concurrentes, la seguridad es más importante. Se puede optimizar después.
