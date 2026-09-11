## Purpose

Controla el acceso a rutas basado en el rol del usuario (admin, staff, parent), incluyendo redirects automáticos post-login y protección de rutas por panel.

## ADDED Requirements

### Requirement: Redirect post-login según rol
El sistema SHALL redirigir al usuario a su panel correspondiente después del login exitoso.

#### Scenario: Staff/Admin login
- **WHEN** un usuario con rol `admin` o `staff` inicia sesión exitosamente
- **THEN** el sistema redirige a `/staff`

#### Scenario: Parent login
- **WHEN** un usuario con rol `parent` inicia sesión exitosamente
- **THEN** el sistema redirige a `/family`

### Requirement: Redirect desde raíz según rol
El sistema SHALL redirigir a `/` hacia el panel correspondiente del usuario autenticado.

#### Scenario: Usuario autenticado accede a raíz
- **WHEN** un usuario autenticado navega a `/`
- **THEN** el sistema redirige a `/staff` si es admin/staff o `/family` si es parent

#### Scenario: Usuario no autenticado accede a raíz
- **WHEN** un usuario no autenticado navega a `/`
- **THEN** el sistema redirige a `/login`

### Requirement: Protección de rutas staff
El sistema SHALL denegar acceso a `/staff/*` a usuarios con rol `parent`.

#### Scenario: Parent accede a ruta staff
- **WHEN** un usuario con rol `parent` navega a cualquier ruta `/staff/*`
- **THEN** el sistema redirige a `/family`

#### Scenario: Staff/Admin accede a ruta staff
- **WHEN** un usuario con rol `admin` o `staff` navega a `/staff/*`
- **THEN** el sistema permite el acceso

### Requirement: Protección de rutas familia
El sistema SHALL denegar acceso a `/family/*` a usuarios con rol `admin` o `staff`.

#### Scenario: Staff/Admin accede a ruta familia
- **WHEN** un usuario con rol `admin` o `staff` navega a cualquier ruta `/family/*`
- **THEN** el sistema redirige a `/staff`

#### Scenario: Parent accede a ruta familia
- **WHEN** un usuario con rol `parent` navega a `/family/*`
- **THEN** el sistema permite el acceso

### Requirement: Rutas públicas sin protección
El sistema SHALL permitir acceso sin autenticación a rutas marcadas como públicas.

#### Scenario: Acceso a rutas públicas
- **WHEN** cualquier usuario navega a `/login`, `/activar-cuenta` o `/api/*`
- **THEN** el sistema permite el acceso sin verificación de sesión

### Requirement: Redirect de rutas públicas para autenticados
El sistema SHALL redirigir usuarios autenticados que intenten acceder a rutas públicas.

#### Scenario: Usuario autenticado accede a login
- **WHEN** un usuario autenticado navega a `/login`
- **THEN** el sistema redirige a su panel correspondiente (`/staff` o `/family`)
