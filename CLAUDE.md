# 7 Flows Synergy

Business fitness system — Apple Health + Fitness+ for business. 29 modes across 4 frameworks, AI coaching by Alicia, health dashboard, progress rings, assessments, training programs.

## Stack

- **Monorepo:** Turborepo with Bun workspaces
- **Frontend:** React 19, Vite, TanStack Router (file-based), TanStack Query, Zustand, Tailwind CSS 4
- **Backend:** Cloudflare Workers, Hono, Drizzle ORM, D1
- **AI:** Anthropic SDK → Cloudflare AI Gateway (BYOK) → Claude Sonnet 4.6, extended thinking enabled
- **Agent:** AliciaAgent Durable Object with SQLite persistence, 7 custom tools
- **Design:** Neumorphic (Wave Artisans), light + dark, Gambarino + Bricolage Grotesque
- **Auth:** Magic links only (passwordless)
- **Linter:** Biome (zero errors, zero warnings)

## Commands

```bash
bun install                        # Install all dependencies
bun run dev                        # Start all dev servers
bun run build                      # Build all packages (Turbo)
bun run lint                       # Lint with Biome
bun run lint:fix                   # Auto-fix lint issues
bun run typecheck                  # Typecheck all packages
bun run test                       # Run all tests
bun turbo <task> --filter='*'      # Run task across all packages
bun run --filter @synergy/api db:generate    # Generate Drizzle migrations
bun run --filter @synergy/api db:migrate     # Apply migrations to D1
bun run --filter @synergy/api db:seed        # Seed frameworks, modes, programs
```

## Project Structure

- `packages/api/` — Cloudflare Worker (Hono API, Drizzle, Alicia agent)
- `packages/web/` — React SPA (TanStack Router, neumorphic UI)
- `packages/shared/` — Zod schemas, types, constants (shared between api and web)
- `wrangler.jsonc` — Single Worker config (Workers Static Assets)

## AI Gateway (BYOK)

The Anthropic API key is stored on the Cloudflare AI Gateway dashboard under Provider Keys. The Worker authenticates to the gateway using `AI_GATEWAY_TOKEN`. No actual API key in Worker code.

```typescript
import { createAnthropicClient } from './lib/anthropic.js'
const anthropic = createAnthropicClient(env) // Uses BYOK pattern
```

## Conventions

- **TypeScript strict mode** everywhere, `noUncheckedIndexedAccess` enabled
- **Biome** for linting and formatting — zero errors, zero warnings
- **Zod schemas** in `packages/shared` are the single source of truth for API contracts
- **Every route handler** wrapped in try/catch with 500 error response
- D1 schema defined with Drizzle ORM in `packages/api/src/db/schema.ts`
- Use `nanoid` for all ID generation
- CSS custom properties (`--surface`, `--shadow-dark`, `--color-error`) auto-adapt to theme
- Wave Motion animation system: use `wave-*` classes, respect `prefers-reduced-motion`
- All Alicia interactions stream via SSE through `POST /api/coach/stream`
- All interactive elements ≥ 44px touch targets (WCAG)
- `aria-current="page"` on active nav links, `aria-live="polite"` on streaming text

## Testing

- Vitest for unit and integration tests
- Tests co-located with source: `foo.test.ts` next to `foo.ts`
- Zero tolerance: all tests must pass, no warnings, no skips
- Run: `bun run test`

## Design System

Colors and shadows use CSS custom properties that auto-switch between light/dark:
- `shadow-neo-panel` — large raised cards
- `shadow-neo-well` — medium elements
- `shadow-neo-button` — interactive buttons
- `shadow-neo-inset` — recessed inputs
- `neo-btn` — neumorphic button with hover/active states
- `input-embossed` — recessed input fields
- `wave-reveal` / `wave-entrance-{1-5}` — staggered animations
- `--color-error` / `--color-success` — semantic colors with dark mode

## Environment Setup

1. Copy `.dev.vars.example` to `.dev.vars`
2. Set JWT_SECRET, MAGIC_LINK_SECRET (generate with `openssl rand -hex 32`)
3. Set CF_ACCOUNT_ID, AI_GATEWAY_ID, AI_GATEWAY_TOKEN from Cloudflare dashboard
4. Store Anthropic API key in AI Gateway dashboard → Provider Keys
5. Run `bun install && bun run dev`
