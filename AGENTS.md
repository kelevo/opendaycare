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

## Spex Driven Development
- /spec: Using this skill for make the specifications.
- /spec-impl: Using this skill for implement the specifications.
- /spec-verify: Using this skill for verify the acceptance criteria of an implemented spec.