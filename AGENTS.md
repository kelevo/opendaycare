<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.
- Tailwind v4: no `tailwind.config.*`. Configure theme/colors via CSS `@theme inline` in `app/globals.css`; import with `@import "tailwindcss"`.
- Path alias `@/*` → repo root (see `tsconfig.json`).
- Next 16 has breaking changes vs older versions — consult `node_modules/next/dist/docs/` before writing code.

## Commands
- `npm run dev` — dev server (port 3000).
- `npm run build` — production build (also runs type checking).
- `npm run lint` — ESLint flat config (`eslint.config.mjs`).
- There is NO test runner or typecheck script configured. Don't guess `npm test` or `tsc`; use `npm run build` to verify types.

## MCPs
- Playwright: screenshots and anything Playwright-related go in `.playwright-mcp/` (gitignored).
- Context7: use the Context7 MCP for up-to-date framework docs.

## Base de datos (Supabase)
- **Toda** migración/tabla/cambio de esquema o datos en Supabase **DEBE** generar su archivo de migración SQL en `supabase/migrations/` con el formato `YYYYMMDDHHMMSS_<nombre>.sql`. Esto es obligatorio, nunca opcional.
- El cambio se aplica al proyecto remoto vía MCP (`apply_migration` / `execute_sql`) y, en paralelo, se versiona el mismo SQL en el archivo de migración local. Ambos deben quedar sincronizados.
- Si ves un spec o tarea que toca la BD y no existe `supabase/migrations/`, detenete y creá el archivo de migración antes de continuar.
- **Cualquier** archivo creado que tenga que ver con la base de datos (migrations, seeds, schemas, docs SQL, tipos, etc.) DEBE ir a la carpeta `specs/database/`. Si no existe la carpeta, se crea.

## Base de datos (specs/database)
- Todos los archivos relacionados con la BD (SQL, esquemas, seeds, documentación, tipos) se almacenan en `specs/database/`.
- Los archivos de migración SQL se siguen versionando en `supabase/migrations/` con el formato `YYYYMMDDHHMMSS_<nombre>.sql`, pero copias/referencias o archivos complementarios de BD van a `specs/database/`.

## Spex Driven Development
- /spec: Using this skill for make the specifications.
- /spec-impl: Using this skill for implement the specifications.
- /spec-verify: Using this skill for verify the acceptance criteria of an implemented spec.

## GitHub Actions
- When using `/oc` from GitHub comments, invoke subagents WITHOUT the `@` prefix:
  - Use: `/oc spec-verify 04-agregar-nino-modal`
  - Do NOT use: `/oc @spec-verify 04-agregar-nino-modal`
  - The `@` syntax fails with "Failed to parse JSON" error in the GitHub Action due to a bug in `anomalyco/opencode/github@latest`.