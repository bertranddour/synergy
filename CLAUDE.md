# 7 Flows Synergy

Business fitness system — Apple Health + Fitness+ for business. 29 modes across 4 frameworks, AI coaching by Alicia, health dashboard, progress rings, assessments, training programs.

## Stack

- **Monorepo:** Turborepo with Bun workspaces
- **Frontend:** React 19, Vite, TanStack Router (file-based), TanStack Query, Zustand, Tailwind CSS 4, shadcn/ui
- **Backend:** Cloudflare Workers, Hono, Drizzle ORM, D1
- **AI:** Anthropic SDK → AI Gateway → Claude Sonnet 4.6, CF Agents SDK (Durable Objects)
- **Design:** Neumorphic (Wave Artisans), light + dark, Gambarino + Bricolage Grotesque

## Commands

```bash
bun install              # Install all dependencies
bun run dev              # Start all dev servers
bun run build            # Build all packages
bun run typecheck        # Typecheck all packages
bun run test             # Run all tests
bun turbo <task> --filter='*'  # Run task across all packages
```

## Project Structure

- `packages/api/` — Cloudflare Worker (Hono API, Drizzle, Alicia agent)
- `packages/web/` — React SPA (TanStack Router, neumorphic UI)
- `packages/shared/` — Zod schemas, types, constants (shared between api and web)
- `wrangler.jsonc` — Single Worker config (Workers Static Assets)

## Conventions

- **TypeScript strict mode** everywhere, `noUncheckedIndexedAccess` enabled
- **Zod schemas** in `packages/shared` are the single source of truth for API contracts
- **Hono RPC** (`hc<AppType>`) provides type-safe API calls from frontend — no manual fetch
- All route handlers validate request bodies with Zod before processing
- D1 schema defined with Drizzle ORM in `packages/api/src/db/schema.ts`
- Use `nanoid` for all ID generation
- CSS custom properties (`--surface`, `--shadow-dark`, `--shadow-light`) auto-adapt to theme
- Wave Motion animation system: use `wave-*` classes, respect `prefers-reduced-motion`
- All Alicia interactions stream via SSE through `POST /api/coach/stream`

## Testing

- Vitest for unit and integration tests
- Tests co-located with source: `foo.test.ts` next to `foo.ts`
- API integration tests use miniflare/D1 local bindings
- Zero tolerance: all tests must pass, no warnings, no skips

## Design System

Colors and shadows use CSS custom properties that auto-switch between light/dark:
- `shadow-neo-panel` — large raised cards
- `shadow-neo-well` — medium elements
- `shadow-neo-button` — interactive buttons
- `shadow-neo-inset` — recessed inputs
- `neo-btn` — neumorphic button with hover/active states
- `input-embossed` — recessed input fields
- `wave-reveal` / `wave-entrance-{1-5}` — staggered animations
