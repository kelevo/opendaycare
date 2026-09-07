# Open Daycare

Sistema de gestión para guardería infantil. Administra niños, padres, asistencia y más.

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Base de datos:** Supabase (PostgreSQL + Auth + Realtime)
- **Email:** Resend
- **AI Agent:** opencode + MCPs (Playwright, Context7, Supabase)

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- npm
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (para desarrollo local con BD)
- Cuenta de [Supabase](https://supabase.com) con un proyecto creado
- API key de [Resend](https://resend.com) (para envío de emails)

## Setup

1. Clonar el repositorio:

```bash
git clone <repo-url>
cd open-daycare
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.template .env.local
```

Editar `.env.local` con tus valores:

| Variable | Descripción |
|---|---|
| `SUPABASE_DB_PASSWORD` | Password de la BD de Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (para frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo server-side) |
| `RESEND_API_KEY` | API key de Resend |

4. Levantar el dev server:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Autenticación con Supabase CLI

El proyecto usa el MCP server de Supabase para interactuar con la BD desde opencode. Para que funcione correctamente, necesitás autenticarte:

### Login con Supabase CLI

```bash
supabase login
```

Esto abre el browser para autenticarte con tu cuenta de Supabase. Después seleccionás el proyecto:

```bash
supabase link --project-ref <tu-project-ref>
```

### Autenticación del MCP Server

El MCP server de Supabase usa OAuth 2.1. Si los tools de Supabase no aparecen en opencode:

1. Verificar que el server sea alcanzable:
   ```bash
   curl -so /dev/null -w "%{http_code}" https://mcp.supabase.com/mcp
   ```
   Un `401` (sin token) confirma que el server está arriba.

2. Crear `.mcp.json` en la raíz del proyecto apuntando a `https://mcp.supabase.com/mcp` si no existe.

3. Autenticar desde opencode — el agente te guiará para completar el flow OAuth en el browser, y después recargar la sesión.

## Comandos disponibles

```bash
npm run dev      # Dev server en puerto 3000
npm run build    # Build de producción (incluye type checking)
npm run start    # Servir build de producción
npm run lint     # Linting con ESLint
```

> **No hay test runner configurado.** Para verificar tipos, usá `npm run build`.

## Estructura del proyecto

```
open-daycare/
├── app/              # App Router - páginas y layouts
├── components/       # Componentes React
├── lib/              # Utilidades, clientes de Supabase, helpers
├── public/           # Assets estáticos
├── specs/            # Specs y documentación de features
│   └── database/     # Referencias SQL, schemas, seeds
├── supabase/
│   └── migrations/   # Migraciones SQL de la BD
└── .claude/skills/   # Skills para AI agents
```
