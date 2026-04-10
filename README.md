# 7 Flows Synergy

**Apple Health + Fitness+ for business.** A personal business fitness system that shows health (data), guides improvement (training), and tracks growth (progress).

29 interactive modes across 4 frameworks. AI coaching by Alicia. Health dashboard with progress rings. Scenario-based assessments. Structured training programs. Team health aggregation.

**Live at [synergy.7flows.com](https://synergy.7flows.com)**

---

## What It Does

Your business has a health profile — validation rigor, async maturity, team connection coverage, scaling friction, AI collaboration depth. These are vital signs that change every week and predict whether your company will thrive or stall.

Synergy tracks them.

- **Health Dashboard** — Five health categories with scores, trends, and sparklines. Open the app and immediately know where you stand.
- **Mode Runner** — 29 guided exercises for your business thinking. An AI coach challenges your answers in real time. Each mode is a workout.
- **Progress Rings** — Three rings: Completion (did you do the work), Consistency (did you show up), Growth (did you improve).
- **Alicia** — AI coaching colleague with extended thinking. Bubbly, brutally honest, zero BS. Questions your assumptions, challenges weak thinking, suggests concrete next actions.
- **Assessments** — Scenario-based diagnostics. No 1-5 scales — real situations with real choices. Maturity levels from Standing Still to Flying.
- **Training Programs** — Guided multi-mode sequences: Your First Validation Week, Async Maturity Sprint, AI Colleague Bootcamp, and more.
- **Teams** — Collective health, shared progress, team-level coaching.

## The Four Frameworks

| Framework | Focus | Modes | For |
|-----------|-------|-------|-----|
| **Core X** | Validation-driven business building | 7 | Solo founders to first teams (1-50) |
| **Air X** | Flex work — async-first | 7 | Any distributed team |
| **Max X** | Scaling without bureaucracy | 8 | Companies growing past 50 people |
| **Synergy X** | Human-AI collaboration | 7 | Everyone (cross-cutting) |

## Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo + Bun |
| **Frontend** | React 19, Vite, TanStack Router, TanStack Query, Zustand, Tailwind CSS 4 |
| **Backend** | Cloudflare Workers, Hono |
| **Database** | Cloudflare D1 (SQLite) + Drizzle ORM |
| **Cache** | Cloudflare KV |
| **Storage** | Cloudflare R2 |
| **AI** | Claude Sonnet 4.6 via Cloudflare AI Gateway (BYOK) + extended thinking |
| **Agent** | AliciaAgent Durable Object with SQLite persistence, 7 custom tools, RPC |
| **Auth** | Passwordless magic links via Resend |
| **Email** | Resend (transactional) |
| **Design** | Neumorphic (Wave Artisans), light + dark mode, Gambarino + Bricolage Grotesque |
| **Linting** | Biome |
| **Testing** | Vitest (172 tests) |
| **Deploy** | Single Worker with Workers Static Assets |

## Project Structure

```
synergy/
├── packages/
│   ├── api/           Cloudflare Worker — Hono API, Drizzle, Alicia agent
│   ├── web/           React SPA — TanStack Router, neumorphic UI
│   └── shared/        Zod schemas, types, constants
├── wrangler.jsonc     Single Worker config
├── biome.json         Linter config
└── turbo.json         Build orchestration
```

## Development

```bash
# Prerequisites: Bun, Wrangler authenticated

# Install
bun install

# Develop
bun run dev

# Lint + typecheck + test
bun run lint
bun run typecheck
bun run test

# Build
cd packages/web && bunx vite build
```

## Deploy

```bash
# Build + deploy to Cloudflare
bun run deploy

# Apply database migrations
bun run deploy:migrations

# Seed database (first deploy only)
bun run deploy:seed

# Upload secrets from .dev.vars
bun run deploy:secrets
```

## Environment

Copy `.dev.vars.example` to `.dev.vars` and fill in:

| Secret | Source |
|--------|--------|
| `JWT_SECRET` | `openssl rand -hex 32` |
| `MAGIC_LINK_SECRET` | `openssl rand -hex 32` |
| `CF_ACCOUNT_ID` | Cloudflare Dashboard → Workers & Pages |
| `AI_GATEWAY_ID` | Cloudflare Dashboard → AI → AI Gateway |
| `AI_GATEWAY_TOKEN` | AI Gateway settings |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |

The Anthropic API key is stored on the AI Gateway dashboard under Provider Keys (BYOK) — not in Worker code.

## Architecture

```
Browser → synergy.7flows.com
            │
            ├── Static assets (React SPA via Workers Static Assets)
            │
            └── /api/* (Hono Worker)
                  ├── Auth (magic links, JWT, KV sessions)
                  ├── Modes, Sessions, Health, Progress, Assessments, Programs, Teams
                  ├── Coach SSE streaming → AliciaAgent DO → Claude API via AI Gateway
                  └── Cron (hourly) → proactive observations via Claude
```

## License

Proprietary. Copyright 2026 7 Flows.
