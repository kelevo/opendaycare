## Why

La aplicación actual muestra la misma interfaz para todos los usuarios independientemente de su rol (admin, staff, parent). No hay separación entre las funcionalidades de gestión del staff y las de visualización de las familias. Esto limita la experiencia de uso y no refleja los permisos reales del sistema.

## What Changes

- **BREAKING**: Se reestructura la navegación raíz (`/`) para redirigir a `/staff` o `/family` según el rol del usuario
- Se agrega protección de rutas por rol en `proxy.ts` (staff/admin acceden a `/staff/*`, parent a `/family/*`)
- Se crean dos paneles separados con layouts y sidebars independientes
- El sidebar se modifica para renderizar items de navegación condicionalmente según el rol
- Se muestran funcionalidades diferenciadas: staff puede crear publicaciones y gestionar niños, familia solo puede ver y reaccionar

## Capabilities

### New Capabilities

- `role-based-routing`: Protección de rutas por rol vía proxy.ts, redirects post-login y desde la raíz
- `staff-panel`: Panel de staff con layout, sidebar y rutas para gestión de niños, feed completo y avisos
- `family-panel`: Panel de familia con layout, sidebar y rutas para ver posts filtrados, hijos vinculados y notificaciones

### Modified Capabilities

- `sidebar-nav`: El sidebar existente se modifica para aceptar prop `role` y renderizar items condicionalmente

## Impact

- **Archivos modificados**: `proxy.ts`, `app/page.tsx`, `app/login/page.tsx`, `components/layout/Sidebar.tsx`
- **Archivos creados**: `app/staff/layout.tsx`, `app/staff/page.tsx`, `app/staff/kids/page.tsx`, `app/staff/kids/[id]/page.tsx`, `app/staff/avisos/page.tsx`, `app/staff/cuenta/page.tsx`, `app/family/layout.tsx`, `app/family/page.tsx`, `app/family/hijos/page.tsx`, `app/family/hijos/[id]/page.tsx`, `app/family/notificaciones/page.tsx`, `app/family/cuenta/page.tsx`
- **Archivos movidos**: `app/kids/page.tsx` → `app/staff/kids/page.tsx`
- **Dependencias**: Ninguna nueva
- **RLS**: Las políticas existentes filtran por `daycare_id`. El feed familiar necesita consultar `parent_children` para filtrar posts por hijos vinculados
