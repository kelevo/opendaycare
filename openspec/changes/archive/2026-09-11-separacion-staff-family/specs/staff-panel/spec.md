## Purpose

Define el panel de administración y staff con layout, navegación y funcionalidades de gestión de la guardería.

## ADDED Requirements

### Requirement: Layout de staff
El sistema SHALL proveer un layout dedicado para el panel de staff que incluya sidebar con navegación funcional.

#### Scenario: Staff accede a panel
- **WHEN** un usuario con rol `admin` o `staff` accede a `/staff`
- **THEN** se renderiza el layout de staff con sidebar y área de contenido

#### Scenario: Sidebar muestra items de staff
- **WHEN** se renderiza el sidebar en el panel de staff
- **THEN** se muestran los items: Feed, Niños, Avisos, Mi cuenta
- **AND** se muestra el botón "Nueva publicación"

### Requirement: Feed de staff muestra todos los posts
El sistema SHALL mostrar todas las publicaciones del daycare en el feed de staff.

#### Scenario: Staff ve feed completo
- **WHEN** un usuario staff accede a `/staff`
- **THEN** se muestran todos los posts del daycare ordenados por fecha de publicación

### Requirement: Gestión de niños
El sistema SHALL permitir al staff ver, agregar y editar niños.

#### Scenario: Staff accede a lista de niños
- **WHEN** un usuario staff navega a `/staff/kids`
- **THEN** se muestra la grilla de niños del daycare con botón "Agregar niño"

#### Scenario: Staff accede a detalle de niño
- **WHEN** un usuario staff navega a `/staff/kids/[id]`
- **THEN** se muestra el detalle del niño con información editable

### Requirement: Gestión de avisos
El sistema SHALL permitir al staff gestionar avisos generales.

#### Scenario: Staff accede a avisos
- **WHEN** un usuario staff navega a `/staff/avisos`
- **THEN** se muestra la sección de gestión de avisos

### Requirement: Mi cuenta staff
El sistema SHALL permitir al staff gestionar su perfil.

#### Scenario: Staff accede a mi cuenta
- **WHEN** un usuario staff navega a `/staff/cuenta`
- **THEN** se muestra la pantalla de perfil del usuario
