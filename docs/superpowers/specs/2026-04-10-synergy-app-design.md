# 7 Flows Synergy — Architecture Design Spec

Apple Health + Fitness+ for business. A personal business fitness system that shows health (data), guides improvement (training), and tracks growth (progress). 29 modes across 4 frameworks, AI coaching by Alicia, progress rings, health dashboard, assessments, training programs, teams.

---

## 1. Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Monorepo** | Turborepo | Shared types, parallel builds, clean boundaries |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS 4 | SPA, fast build, type-safe |
| **Routing** | TanStack Router (file-based) | Type-safe, SPA-native |
| **Server state** | TanStack Query | Caching, optimistic updates, stale-while-revalidate |
| **Client state** | Zustand | Lightweight UI state (theme, sidebar, active mode) |
| **Components** | shadcn/ui + custom neumorphic layer | Wave Artisans shadow system on top of shadcn primitives |
| **Backend** | Cloudflare Workers + Hono | Edge-first, TypeScript-native, sub-50ms |
| **API client** | Hono RPC (`hc<AppType>`) | End-to-end type safety, zero codegen |
| **Database** | Cloudflare D1 + Drizzle ORM | SQLite at edge, type-safe queries, 5KB bundle |
| **Validation** | Zod (shared) | Single source of truth for API contracts |
| **Cache/Sessions** | Cloudflare KV | JWT sessions, mode spec cache |
| **Agent infra** | Cloudflare Agents SDK (Durable Objects) | Per-user agent state, SQLite, scheduling, hibernation |
| **AI (heavy)** | Anthropic SDK → Cloudflare AI Gateway → Claude Sonnet 4.6 | Extended thinking, tool use, streaming |
| **AI (light)** | Cloudflare Workers AI | Trend detection, quick summaries |
| **Streaming** | Server-Sent Events (SSE) | All Alicia responses, all surfaces |
| **Storage** | Cloudflare R2 | Exports, uploads |
| **Background** | Cron Trigger + Cloudflare Queues | Proactive observation generation |
| **Auth** | Magic links + OAuth (Google, GitHub) | Passwordless primary |
| **Deploy** | Single Worker (Workers Static Assets) | API + SPA in one deploy, SPA fallback |
| **Config** | `wrangler.jsonc` | CF-recommended for new projects |
| **Typography** | Gambarino (headings) + Bricolage Grotesque (body) | Wave Artisans design system |
| **Theme** | Neumorphic, light + dark mode | OKLCH zinc system with dual shadow sets |
| **Package manager** | Bun | Fast installs, native TypeScript, workspace support |
| **Testing** | Vitest (unit/integration) + Playwright (E2E) | Fast, edge-compatible |

---

## 2. Project Structure

```
synergy/
├── packages/
│   ├── api/                          # Cloudflare Worker (Hono)
│   │   ├── src/
│   │   │   ├── index.ts              # Worker entry, Hono app, exports
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts           # Magic link, OAuth, JWT
│   │   │   │   ├── users.ts          # Profile, frameworks
│   │   │   │   ├── modes.ts          # Mode library, detail
│   │   │   │   ├── sessions.ts       # Session CRUD, progressive save
│   │   │   │   ├── health.ts         # Health dashboard, detail
│   │   │   │   ├── coach.ts          # SSE streaming, conversations
│   │   │   │   ├── assessments.ts    # Scenario-based diagnostics
│   │   │   │   ├── progress.ts       # Rings, history
│   │   │   │   ├── programs.ts       # Training programs
│   │   │   │   └── teams.ts          # Team CRUD, health
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # JWT validation
│   │   │   │   └── rate-limit.ts     # Per-endpoint limits
│   │   │   ├── services/
│   │   │   │   ├── health.ts         # Score calculation, caching
│   │   │   │   ├── metrics.ts        # Metric aggregation
│   │   │   │   └── proactive.ts      # Queue consumer for observations
│   │   │   ├── agents/
│   │   │   │   └── alicia/
│   │   │   │       ├── agent.ts      # AliciaAgent (CF Agents SDK DO)
│   │   │   │       ├── loop.ts       # Custom agent loop (Anthropic SDK)
│   │   │   │       ├── tools/        # D1-backed custom tools
│   │   │   │       │   ├── health.ts
│   │   │   │       │   ├── sessions.ts
│   │   │   │       │   ├── assumptions.ts
│   │   │   │       │   ├── modes.ts
│   │   │   │       │   ├── context.ts
│   │   │   │       │   ├── assessments.ts
│   │   │   │       │   └── progress.ts
│   │   │   │       ├── prompts/
│   │   │   │       │   ├── personality.ts  # From Alicia plugin
│   │   │   │       │   ├── cross-fw.ts     # Cross-framework intelligence
│   │   │   │       │   └── mode-coach.ts   # Per-mode coaching prompts
│   │   │   │       └── surfaces.ts  # Surface-specific prompt assembly
│   │   │   └── db/
│   │   │       ├── schema.ts         # Drizzle schemas (all tables)
│   │   │       ├── seed.ts           # Seed 29 modes from framework docs
│   │   │       └── migrations/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                          # React SPA
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── routes/               # TanStack file-based routes
│   │   │   │   ├── __root.tsx        # Shell, nav, theme
│   │   │   │   ├── _auth.tsx         # Auth guard layout
│   │   │   │   ├── _auth/
│   │   │   │   │   ├── index.tsx     # Dashboard
│   │   │   │   │   ├── modes/
│   │   │   │   │   │   ├── index.tsx # Mode library
│   │   │   │   │   │   └── $slug.tsx # Mode detail
│   │   │   │   │   ├── runner/
│   │   │   │   │   │   └── $sessionId.tsx  # Mode Runner
│   │   │   │   │   ├── coach/
│   │   │   │   │   │   └── index.tsx # Chat with Alicia
│   │   │   │   │   ├── assessments/
│   │   │   │   │   │   ├── index.tsx # Assessment center
│   │   │   │   │   │   └── $id.tsx   # Active assessment
│   │   │   │   │   ├── programs/
│   │   │   │   │   │   ├── index.tsx # Program catalog
│   │   │   │   │   │   └── active.tsx
│   │   │   │   │   ├── progress/
│   │   │   │   │   │   └── index.tsx # Ring history
│   │   │   │   │   ├── teams/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   └── $id.tsx
│   │   │   │   │   └── settings/
│   │   │   │   │       └── index.tsx
│   │   │   │   └── login.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn/ui + neumorphic overrides
│   │   │   │   ├── dashboard/        # HealthCard, ProgressRings, NudgeCard
│   │   │   │   ├── modes/            # ModeCard, ModeRunner, FieldStep
│   │   │   │   ├── coach/            # ChatBubble, CoachCard, StreamingText
│   │   │   │   ├── assessments/      # ScenarioCard, ResultsView
│   │   │   │   └── layout/           # Shell, Nav, Sidebar, MobileNav
│   │   │   ├── hooks/
│   │   │   │   ├── use-sse.ts        # SSE client for Alicia streaming
│   │   │   │   └── use-theme.ts      # Light/dark theme toggle
│   │   │   ├── stores/
│   │   │   │   ├── ui.ts             # Theme, sidebar, nav
│   │   │   │   ├── runner.ts         # Mode runner state
│   │   │   │   └── coach.ts          # Streaming text buffer
│   │   │   ├── lib/
│   │   │   │   └── api.ts            # Hono RPC client + TanStack Query
│   │   │   └── styles/
│   │   │       ├── global.css        # Design tokens, shadows, animations
│   │   │       └── fonts.css         # Gambarino + Bricolage Grotesque
│   │   ├── public/
│   │   │   └── fonts/                # Self-hosted woff2 files
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── shared/                       # Shared types & schemas
│       ├── src/
│       │   ├── schemas/              # Zod schemas (API contracts)
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── modes.ts
│       │   │   ├── sessions.ts
│       │   │   ├── health.ts
│       │   │   ├── coach.ts
│       │   │   ├── assessments.ts
│       │   │   ├── progress.ts
│       │   │   ├── programs.ts
│       │   │   └── teams.ts
│       │   ├── types/                # Inferred from Zod schemas
│       │   └── constants/            # Framework colors, mode slugs, etc.
│       ├── package.json
│       └── tsconfig.json
│
├── wrangler.jsonc                    # Single Worker config
├── turbo.json
├── package.json                      # Workspace root
├── CLAUDE.md
└── vitest.config.ts
```

---

## 3. Design System

Adapted from the Wave Artisans neumorphic design system for both light and dark themes.

### Color System (OKLCH CSS Custom Properties)

```css
/* Light mode (Wave Artisans base) */
:root {
  --surface:       oklch(0.92 0.004 286.32);   /* zinc-200 */
  --shadow-dark:   oklch(0.712 0.0129 286.07);  /* zinc-400 */
  --shadow-light:  oklch(0.985 0 0);            /* zinc-50 */
  --text-primary:  oklch(0.274 0.006 286.03);   /* zinc-800 */
  --text-secondary: oklch(0.442 0.0146 285);    /* zinc-600 */
  --text-tertiary: oklch(0.552 0.0138 285.94);  /* zinc-500 */
}

/* Dark mode (inverted neumorphic) */
:root.dark {
  --surface:       oklch(0.21 0.006 286);
  --shadow-dark:   oklch(0.14 0.005 286);
  --shadow-light:  oklch(0.30 0.007 286);
  --text-primary:  oklch(0.92 0.004 286);
  --text-secondary: oklch(0.712 0.013 286);
  --text-tertiary: oklch(0.552 0.014 286);
}
```

### Framework Accent Colors

| Framework | Hex | Usage |
|-----------|-----|-------|
| Core | `#3B82F6` (blue) | Badges, cards, outer progress ring |
| Air | `#14B8A6` (teal) | Badges, cards, middle progress ring |
| Max | `#8B5CF6` (purple) | Badges, cards |
| Synergy | `#F59E0B` (amber) | Badges, cards, Alicia's UI, inner progress ring |

### Health Score Colors

| Range | Color | Hex |
|-------|-------|-----|
| > 70 | Green | `#22C55E` |
| 40-70 | Yellow | `#EAB308` |
| 20-40 | Orange | `#F97316` |
| < 20 | Red | `#EF4444` |

### Shadow System (Theme-Aware)

All shadows reference `--shadow-dark` and `--shadow-light`, auto-adapting to light/dark:

| Class | Purpose | Recipe |
|-------|---------|--------|
| `shadow-neo-panel` | Dashboard cards | `25px 25px 60px var(--shadow-dark), -25px -25px 60px var(--shadow-light)` |
| `shadow-neo-well` | Mode cards | `18px 18px 40px var(--shadow-dark), -18px -18px 40px var(--shadow-light)` |
| `shadow-neo-button` | Buttons | `12px 12px 32px var(--shadow-dark), -12px -12px 32px var(--shadow-light)` |
| `shadow-neo-inset` | Inputs, ring tracks | `inset 20px 20px 40px var(--shadow-dark), inset -20px -20px 40px var(--shadow-light)` |
| `shadow-neo-embossed` | Assessment cards | `inset 15px 15px 32px var(--shadow-dark), inset -15px -15px 32px var(--shadow-light)` |

### Wave Motion System

```css
:root {
  --wave-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --wave-ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  --wave-duration-fast: 200ms;
  --wave-duration-base: 450ms;
  --wave-duration-slow: 700ms;
  --wave-stagger: 80ms;
  --wave-distance: 24px;
}
```

- `wave-reveal`: Scroll-triggered reveal (opacity + translateY)
- `wave-entrance-{1-5}`: Staggered page-load entrances
- `wave-card-hover`: Card hover lift (pointer-only)
- All respect `prefers-reduced-motion`

### Typography

| Usage | Font | Recipe |
|-------|------|--------|
| Display | Gambarino | `text-4xl md:text-5xl font-semibold tracking-tight` |
| Section heading | Gambarino | `text-2xl font-semibold` |
| Body | Bricolage Grotesque | `text-base leading-relaxed` |
| Label | Bricolage Grotesque | `text-xs uppercase tracking-[0.3em]` |
| Metric value | Bricolage Grotesque | `text-4xl font-bold` |
| Alicia message | Bricolage Grotesque | `text-base` with amber left border |

Fonts self-hosted as woff2, preloaded via `<link rel="preload">`.

---

## 4. Data Model

All schemas defined with Drizzle ORM for Cloudflare D1. Full schema as specified in the original spec:

- `users` — id, email, name, avatar, stage, teamSize, onboardingCompleted
- `teams` — id, name, type (mission/platform/leadership-circle), ownerId
- `teamMembers` — teamId, userId, role (lead/member)
- `frameworks` — id, slug (core/air/max/synergy), name, description, color, modeCount
- `userFrameworks` — userId, frameworkId, active, activatedAt
- `modes` — id, frameworkId, slug, name, purpose, trigger, flowName, fieldsSchema (JSON), aiCoachPrompts (JSON), doneSignal, metricsSchema (JSON), composabilityHooks (JSON), timeEstimateMinutes, sortOrder
- `sessions` — id, userId, teamId, modeId, status, fieldsData (JSON), currentFieldIndex, decision, startedAt, completedAt
- `metrics` — id, userId, teamId, sessionId, category, name, value, unit, recordedAt
- `assessments` — id, userId, frameworkId, status, responses (JSON), totalScore, maxScore, level, recommendations (JSON)
- `progress` — id, userId, completionRing, consistencyStreak, growthScore, modesCompletedThisPeriod, modesRecommendedThisPeriod, periodStart, periodEnd
- `coachConversations` — id, userId, sessionId, messages (JSON), context (JSON)
- `proactiveObservations` — id, userId, triggerType, title, message, suggestedModeSlug, dismissed, actedOn
- `trainingPrograms` — id, slug, name, description, durationDays, frameworksRequired (JSON), modeSequence (JSON), targetStage
- `userPrograms` — id, userId, programId, status, startDate, currentDay, completedModes (JSON), metricsSnapshot (JSON)

Drizzle schema in `packages/api/src/db/schema.ts` is the single source of truth. Migrations auto-generated via `drizzle-kit generate`.

### Shared Zod Schemas

Every API request/response gets a Zod schema in `packages/shared/src/schemas/`. These serve as the contract between frontend and backend:
- Backend: Hono middleware validates request bodies
- Frontend: Form validation and type inference via `z.infer<typeof schema>`
- Types: Inferred from Zod, never manually duplicated

---

## 5. API Design

All routes via Hono on Cloudflare Workers. Base: `synergy.7flows.com/api`.

```typescript
const app = new Hono<{ Bindings: Env }>()
  .route('/api/auth', authRoutes)
  .route('/api/users', auth(), userRoutes)
  .route('/api/modes', auth(), modeRoutes)
  .route('/api/sessions', auth(), sessionRoutes)
  .route('/api/health', auth(), healthRoutes)
  .route('/api/coach', auth(), coachRoutes)
  .route('/api/assessments', auth(), assessmentRoutes)
  .route('/api/progress', auth(), progressRoutes)
  .route('/api/programs', auth(), programRoutes)
  .route('/api/teams', auth(), teamRoutes)

export type AppType = typeof app
```

Full route definitions as specified in the original spec (auth, users, modes, sessions, health, assessments, progress, coach, programs, teams). Hono RPC client (`hc<AppType>`) provides end-to-end type safety.

### Caching Strategy

| Data | Cache | TTL |
|------|-------|-----|
| Health scores | KV | 5 min |
| Mode specs | KV | 1 hour |
| Sessions | No cache | Real-time |
| Progress rings | KV | 5 min |

### SSE Streaming Endpoint

```
POST /api/coach/stream
  Headers: Authorization: Bearer <jwt>, Accept: text/event-stream
  Body: { message, conversationId?, sessionId?, surface }
  Response: text/event-stream
    data: {"type":"text","content":"..."}
    data: {"type":"tool_call","name":"get_health_scores"}
    data: {"type":"text","content":"..."}
    data: {"type":"done","conversationId":"xxx"}
```

All Alicia interactions use this single SSE endpoint. The `surface` parameter determines prompt assembly (dashboard, mode-runner, chat, assessment, composability).

---

## 6. Alicia Agent Architecture

### Stack

**Cloudflare Agents SDK** for infrastructure (Durable Object state, SQLite persistence, scheduling, hibernation) + **Anthropic SDK** for AI (extended thinking, tool_use, streaming) through **AI Gateway** (caching, analytics, rate limiting, cost tracking).

### Architecture

```
Browser ──POST──▶ CF Worker (Hono)
                    │
                    ├── /api/coach/stream (SSE endpoint)
                    │     ├── Read DO state (conversation history)
                    │     ├── Build surface-specific system prompt
                    │     ├── Run agent loop (Anthropic SDK)
                    │     │     ├── Extended thinking (budget: 8K tokens)
                    │     │     ├── Tool calls → D1 queries (direct)
                    │     │     └── Streaming chunks
                    │     ├── Update DO state (new messages)
                    │     └── Pipe SSE events to browser
                    │
                    └── AliciaAgent (Durable Object)
                          ├── SQLite: conversation history, context snapshots
                          ├── this.schedule(): hourly proactive checks
                          └── Hibernation when idle (zero cost)
```

### System Prompt Construction

Four layers assembled per request:

1. **Personality (constant):** ~500 words from Alicia plugin. Bubbly, punchy, brutally honest, witty, disciplined, supportive, zero BS. Question-challenge-suggest pattern. Banned words list (35 words).

2. **Cross-framework intelligence (constant):** Pattern recognition rules. Execution slow → check Air modes. Priority confusion at scale → that's Max. AI distrust → check Synergy verification. Info silos at 100+ → organizational (Max) not team-level (Air).

3. **User context (per request, from tools):** Instead of stuffing context into the prompt, Alicia calls tools to fetch what she needs:
   - `get_health_scores()` → 5-category health with trends
   - `get_recent_sessions(limit)` → last N mode sessions
   - `check_stale_assumptions()` → assumptions untested >90 days
   - `suggest_mode(weakness)` → best mode for a health gap
   - `get_business_context()` → stage, team size, active frameworks
   - `get_assessment_history(framework)` → score progression
   - `get_progress_rings()` → completion, consistency, growth

4. **Surface context (per request):**

| Surface | Additional prompt |
|---------|------------------|
| Dashboard nudges | "Generate a proactive observation. Be specific. Reference data." |
| Mode Runner | Mode spec + current field + AI Coach Prompts for this field |
| Open chat | "Full coaching conversation. Open with most pressing observation." |
| Assessment debrief | "Deliver results in your voice. Not a score card — a coaching debrief." |
| Composability | "Suggest the next connected mode. Explain why in one sentence." |

### Custom Agent Loop

```typescript
// packages/api/src/agents/alicia/loop.ts
async function runAliciaLoop(params: {
  anthropic: Anthropic
  messages: Message[]
  systemPrompt: string
  tools: Tool[]
  env: Env
  onChunk: (chunk: string) => void
}) {
  let continueLoop = true
  
  while (continueLoop) {
    const stream = await params.anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      thinking: { type: 'enabled', budget_tokens: 8000 },
      system: params.systemPrompt,
      tools: params.tools,
      messages: params.messages,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        params.onChunk(event.delta.text)
      }
    }

    const final = stream.finalMessage()
    const toolCalls = final.content.filter(b => b.type === 'tool_use')

    if (toolCalls.length === 0) {
      continueLoop = false
      break
    }

    // Execute tools (D1 queries via env.DB)
    const results = await Promise.all(
      toolCalls.map(tc => executeTool(tc, params.env))
    )

    // Add to conversation and continue
    params.messages.push({ role: 'assistant', content: final.content })
    params.messages.push({ role: 'user', content: results })
  }
}
```

### AI Gateway Integration

```typescript
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic`
})
```

All Claude calls proxied through AI Gateway for caching, rate limiting, analytics, cost tracking.

### Proactive Observations

AliciaAgent Durable Object schedules hourly checks via `this.schedule()`. For each active user, checks 5 trigger conditions:

1. **Stale assumptions:** any assumption untested >90 days
2. **Procrastination:** any next action >7 days overdue
3. **Health decline:** any category declining for 2+ periods
4. **Framework readiness:** user context suggests unused framework
5. **Missing context:** no business context on file

Triggered observations get a Claude call (personality + trigger context) to generate the message in Alicia's voice. Saved to `proactiveObservations` table. Surface on next dashboard load.

### Reusing the Alicia Plugin

Personality prompt, cross-framework intelligence rules, banned words list, proactive trigger definitions, and voice guide are all sourced from the existing plugin at `skillsboutique-skills/plugins/alicia-7flows`. Adapted from file-system tools to D1-backed tools.

---

## 7. Frontend Architecture

### Data Fetching

```typescript
// packages/web/src/lib/api.ts
import { hc } from 'hono/client'
import type { AppType } from '@synergy/api'

export const api = hc<AppType>('/api')

// In components via TanStack Query:
const { data } = useQuery({
  queryKey: ['health'],
  queryFn: () => api.health.$get().then(r => r.json()),
  staleTime: 5 * 60 * 1000,
})
```

### SSE Client

```typescript
// packages/web/src/hooks/use-sse.ts
function useAliciaStream(params: StreamParams) {
  // POST to /api/coach/stream
  // Parse SSE events: text, tool_call, done
  // Append text chunks to streaming buffer
  // Return: { text, isStreaming, send }
}
```

### Zustand Stores

- `stores/ui.ts` — theme (light/dark), sidebar open, mobile nav
- `stores/runner.ts` — current field index, coaching visible, fields data
- `stores/coach.ts` — streaming text buffer, conversation state

### Responsive Design (Mobile-First)

- **Mobile** (default): Single column, bottom nav, full-screen Mode Runner
- **Tablet** (md:): Two-column dashboard, sidebar nav
- **Desktop** (lg:): Three-column dashboard grid, persistent sidebar

### Key Components

| Component | Description |
|-----------|-------------|
| HealthCard | Neumorphic raised card. Big score number, trend arrow, sparkline, framework color accent |
| ProgressRings | Animated SVG. Three concentric circles. CSS transforms. Particle burst on closure |
| ModeCard | Neumorphic well. Framework badge, name, purpose, time, recommended indicator |
| ModeRunner | Full-screen stepper. One field at a time. Progress bar. Alicia card slides up |
| CoachCard | Amber-bordered message card. Alicia's inline coaching |
| NudgeCard | Proactive observation. Dismiss/act buttons. Amber gradient |
| ChatBubble | Left (Alicia) / Right (user). Streaming text. Action chips |
| ScenarioCard | Full-width. 4 selectable response options. Color shift on select |
| FrameworkToggle | Large card + switch. Expansion animation on toggle |
| SparklineChart | Inline SVG. 12 data points. Fits inside health cards |

### Micro-Transitions

- Page transitions: `wave-reveal` scroll-triggered
- Card hover: lift + shadow enhancement (pointer-only)
- Mode Runner field: slide-left + fade between fields
- Alicia coaching: slide-up from bottom, spring easing (`--wave-ease`)
- Ring fill: CSS transition with `--wave-ease`, `--wave-duration-slow`
- Ring closure: particle burst (CSS keyframes)
- Scenario selection: color shift + slide to next
- Framework toggle: expansion showing new capabilities
- All disabled under `prefers-reduced-motion`

---

## 8. Deployment

### Workers Static Assets (Single Worker)

```jsonc
// wrangler.jsonc
{
  "name": "synergy-api",
  "main": "packages/api/src/index.ts",
  "compatibility_date": "2026-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./packages/web/dist",
    "binding": "ASSETS",
    "run_worker_first": ["/api/*"],
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [{
    "binding": "DB",
    "database_name": "synergy-db",
    "database_id": "<generated>"
  }],
  "kv_namespaces": [{
    "binding": "KV",
    "id": "<generated>"
  }],
  "r2_buckets": [{
    "binding": "R2",
    "bucket_name": "synergy-uploads"
  }],
  "queues": {
    "producers": [{ "binding": "QUEUE", "queue": "synergy-background" }],
    "consumers": [{ "queue": "synergy-background", "max_batch_size": 10 }]
  },
  "durable_objects": {
    "bindings": [
      { "name": "ALICIA", "class_name": "AliciaAgent" }
    ]
  },
  "migrations": [
    { "tag": "v1", "new_sqlite_classes": ["AliciaAgent"] }
  ],
  "triggers": {
    "crons": ["0 * * * *"]
  },
  "ai": { "binding": "AI" },
  "vars": {
    "ENVIRONMENT": "production"
  }
}
```

### Domain

- `synergy.7flows.com` → Single Worker (static assets + API)
- `/api/*` → Worker code (Hono routes)
- Everything else → SPA fallback (`index.html`)
- SSL: Cloudflare automatic (full strict)

### CI/CD

```
GitHub push to main
  └── GitHub Action:
      1. bun run build (Turborepo builds all packages)
      2. bun run test (Vitest)
      3. bunx drizzle-kit generate (migration check)
      4. bunx wrangler deploy (single Worker + static assets)
      5. bunx wrangler d1 migrations apply synergy-db
```

### Secrets

```
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put JWT_SECRET
wrangler secret put MAGIC_LINK_SECRET
```

---

## 9. Authentication

### Magic Link Flow (Primary)

1. User enters email → `POST /api/auth/magic-link`
2. Generate signed token (HMAC-SHA256), store in KV (15-min TTL), send email
3. User clicks link → `GET /api/auth/verify?token=xxx`
4. Validate token, create/retrieve user, generate JWT, store session in KV
5. JWT returned, stored in localStorage. 7-day expiry.
6. Refresh: `/api/auth/me` rotates token within 24h of expiry

### OAuth (Google, GitHub)

Standard OAuth 2.0. After callback: same as magic link (create/retrieve user, JWT, KV session).

### Authorization

| Role | Access |
|------|--------|
| Solo user | Full access to own data |
| Team lead | Own data + team dashboard + member progress rings |
| Team member | Own data + team-level aggregates |

---

## 10. Security

- Encryption at rest (D1, KV, R2 — Cloudflare default)
- HTTPS only, full strict SSL
- CORS restricted to `synergy.7flows.com`
- Rate limiting: 100 req/min general, 20 req/min coach endpoints
- Zod validation on all request bodies
- No PII in logs
- API keys as Workers secrets
- GDPR: `GET /api/users/me/export`, `DELETE /api/users/me`

---

## 11. 7 Flows Knowledge Base

### Source Content

All mode specs and framework knowledge sourced from:
- `7flows-frameworks/library/foundations/` — 6 documents (mode format, composability, tone/voice, assessment system, document structure, case study format)
- `7flows-frameworks/library/frameworks/` — 4 documents (Core X, Air X, Max X, Synergy X)

### 29 Modes (Seeded to D1)

| # | Mode | Framework | Flow |
|---|------|-----------|------|
| 1-7 | Validation, Insight Capture, Proposition Builder, Business Engine, Priority Stack, Execution Tracker, Delivery Check | Core X | Validation, Strategy, Execution |
| 8-14 | Information Architecture, Flex Work Design, Team Rhythm, Async Decision, Package, Contribution Tracker, Culture at Distance | Air X | Inform, Coordinate, Communicate, Recognize, Culture |
| 15-22 | Dashboard, Org Map, Team Blueprint, Connection Map, Relationship Health, Company Priority, Scaled Execution, Quality Matrix | Max X | Monitor, Structure, Connect, Align, Execute, Quality |
| 23-29 | AI Colleague Onboarding, Centaur Assessment, Decision Protocol, Verification Ritual, Knowledge Architecture, Trust Calibration, AI Collaboration Scaling | Synergy X | Context, Govern, Knowledge, Trust, Scale |

Each mode has 8 standard fields: Name, Purpose, Trigger, Fields/Inputs, AI Coach Prompts, Done Signal, Metrics, Composability Hooks. Parsed from markdown and seeded into the `modes` table.

### Composability Network

Modes connect across frameworks via composability hooks:
- Core → Air: Validated results package for async team review
- Core → Max: Validated propositions scale into company priorities
- Core → Synergy: Insights feed AI context, validation gets AI counter-hypotheses
- Air → Max: Team rhythms inform cross-team coordination
- Max → Synergy: Org metrics feed AI dashboard monitoring
- Synergy → All: AI participates in every flow

---

## 12. Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

Turborepo scaffold. Hono Worker with route stubs, auth middleware, D1 + Drizzle schema. React SPA with TanStack Router, Tailwind 4, neumorphic design tokens (light + dark). Auth: magic links + OAuth. User CRUD, framework activation. `wrangler.jsonc` with Workers Static Assets. CI/CD. Domain live.

**Exit:** User signs up, sets stage, activates frameworks, sees empty dashboard.

### Phase 2: Core Experience (Weeks 4-7)

Mode Library UI. Mode Runner (field-by-field, progressive save). Session CRUD. Seed 29 modes. Basic health dashboard (5 cards, no trends). Metric recording. Progress rings shell.

**Exit:** User browses modes, starts Validation Mode, walks 10 fields, completes, sees health score update.

### Phase 3: AI Coach (Weeks 8-10)

AliciaAgent Durable Object. Anthropic SDK through AI Gateway. Personality + cross-framework intelligence prompts. 7 custom tools (D1-backed). Agent loop with extended thinking. In-mode SSE coaching. Open chat. Proactive observations (scheduled). Dashboard nudges.

**Exit:** Alicia challenges a weak assumption in real time. Stale assumption nudge appears on dashboard. Chat references user's specific business context.

### Phase 4: Progress + Polish (Weeks 11-13)

Animated progress rings (SVG, CSS). Ring calculation. Assessment Center (scenarios, scoring, Alicia debrief). Training programs (5 pre-built). Health trends (sparklines). AI composability suggestions. Dark mode. PWA. GDPR.

**Exit:** User enrolls in "Your First Validation Week," completes 5 modes in 5 days, watches rings close, sees before/after metrics.

### Phase 5: Teams (Weeks 14-16)

Team CRUD. Team health dashboard. Member progress. Connection Map visualization. Shared training programs. Team-level Alicia coaching.

**Exit:** Team lead sees collective health, tracks member progress, gets Alicia's team-level observations.

---

## 13. Verification

1. `bun run dev` — Wrangler dev with D1/KV local
2. Magic link login → empty dashboard
3. Activate Core → 7 modes in library
4. Start Validation Mode → field-by-field with progressive save
5. Alicia challenges after each field (SSE streaming)
6. Complete → health score updates, ring advances
7. Dashboard: health card + Alicia nudge
8. Coach chat: references recent session context
9. Assessment: scenarios, scoring, Alicia debrief
10. Training program: calendar with daily modes

Testing: Vitest (unit/integration), Playwright (E2E).
