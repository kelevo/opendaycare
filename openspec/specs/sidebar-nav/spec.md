## Purpose

El sidebar se modifica para renderizar items de navegación condicionalmente según el rol del usuario.

## ADDED Requirements

### Requirement: Navegación condicional por rol
El sidebar SHALL mostrar diferentes items de navegación según el rol del usuario.

#### Scenario: Sidebar para admin/staff
- **WHEN** el sidebar recibe `role="admin"` o `role="staff"`
- **THEN** muestra items: Feed (`/staff`), Niños (`/staff/kids`), Avisos (`/staff/avisos`), Mi cuenta (`/staff/cuenta`)
- **AND** muestra botón "Nueva publicación"

#### Scenario: Sidebar para parent
- **WHEN** el sidebar recibe `role="parent"`
- **THEN** muestra items: Feed (`/family`), Mis hijos (`/family/hijos`), Notificaciones (`/family/notificaciones`), Mi cuenta (`/family/cuenta`)
- **AND** NO muestra botón "Nueva publicación"

### Requirement: Items activos según ruta
El sidebar SHALL resaltar el item activo según la ruta actual.

#### Scenario: Item activo en staff
- **WHEN** la ruta actual comienza con `/staff/kids`
- **THEN** el item "Niños" se resalta como activo

#### Scenario: Item activo en familia
- **WHEN** la ruta actual comienza con `/family/hijos`
- **THEN** el item "Mis hijos" se resalta como activo
