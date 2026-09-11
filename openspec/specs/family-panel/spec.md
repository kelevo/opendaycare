## Purpose

Define el panel de familia con layout, navegación y funcionalidades de visualización de información de sus hijos vinculados.

## ADDED Requirements

### Requirement: Layout de familia
El sistema SHALL proveer un layout dedicado para el panel de familia que incluya sidebar con navegación simplificada.

#### Scenario: Parent accede a panel
- **WHEN** un usuario con rol `parent` accede a `/family`
- **THEN** se renderiza el layout de familia con sidebar y área de contenido

#### Scenario: Sidebar muestra items de familia
- **WHEN** se renderiza el sidebar en el panel de familia
- **THEN** se muestran los items: Feed, Mis hijos, Notificaciones, Mi cuenta
- **AND** NO se muestra el botón "Nueva publicación"

### Requirement: Feed de familia muestra posts filtrados
El sistema SHALL mostrar solo posts relevantes para los hijos del parent.

#### Scenario: Parent ve posts de sus hijos
- **WHEN** un usuario parent accede a `/family`
- **THEN** se muestran posts etiquetados con sus hijos vinculados
- **AND** se muestran anuncios generales de la sala

#### Scenario: Parent no ve posts de otros hijos
- **WHEN** un usuario parent accede a `/family`
- **THEN** NO se muestran posts etiquetados con hijos de otros padres

### Requirement: Vista de hijos vinculados
El sistema SHALL mostrar solo los hijos vinculados al parent.

#### Scenario: Parent accede a mis hijos
- **WHEN** un usuario parent navega a `/family/hijos`
- **THEN** se muestra la lista de hijos vinculados (via `parent_children`)
- **AND** NO se muestra el botón "Agregar niño"

#### Scenario: Parent accede a detalle de hijo
- **WHEN** un usuario parent navega a `/family/hijos/[id]`
- **THEN** se muestra el detalle del hijo en modo solo lectura

### Requirement: Notificaciones
El sistema SHALL mostrar notificaciones relevantes al parent.

#### Scenario: Parent accede a notificaciones
- **WHEN** un usuario parent navega a `/family/notificaciones`
- **THEN** se muestra la sección de notificaciones

### Requirement: Mi cuenta familia
El sistema SHALL permitir al parent gestionar su perfil.

#### Scenario: Parent accede a mi cuenta
- **WHEN** un usuario parent navega a `/family/cuenta`
- **THEN** se muestra la pantalla de perfil del usuario
