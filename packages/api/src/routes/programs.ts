import { and, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { frameworks, modes, trainingPrograms, userPrograms } from '../db/schema.js'
import type { Env } from '../env.js'
import { createAnthropicClient } from '../lib/anthropic.js'
import { createDb } from '../lib/db.js'
import { resolveContent } from '../lib/i18n.js'
import { newId } from '../lib/id.js'
import { calculateHealth } from '../services/health.js'

const programRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

// ─── List Programs ───────────────────────────────────────────────────────────

programRoutes.get('/', async (c) => {
  const locale = c.get('locale')
  const db = createDb(c.env.DB)
  const programs = await db.select().from(trainingPrograms)

  // Collect all unique mode slugs and framework slugs across all programs
  const allModeSlugs = [...new Set(programs.flatMap((p) => p.modeSequence.map((s) => s.modeSlug)))]
  const allFrameworkSlugs = [...new Set(programs.flatMap((p) => p.frameworksRequired))]

  // Batch-fetch translated mode names
  const modeRows =
    allModeSlugs.length > 0
      ? await db
          .select({ slug: modes.slug, name: modes.name, translations: modes.translations })
          .from(modes)
          .where(inArray(modes.slug, allModeSlugs))
      : []
  const modeNameBySlug = new Map(
    modeRows.map((m) => {
      const resolved = resolveContent(m, locale)
      return [resolved.slug, resolved.name]
    }),
  )

  // Batch-fetch translated framework names
  const frameworkRows =
    allFrameworkSlugs.length > 0
      ? await db
          .select({ slug: frameworks.slug, name: frameworks.name, translations: frameworks.translations })
          .from(frameworks)
          .where(inArray(frameworks.slug, allFrameworkSlugs as ('core' | 'air' | 'max' | 'synergy')[]))
      : []
  const frameworkNameBySlug = new Map<string, string>(
    frameworkRows.map((f) => {
      const resolved = resolveContent(f, locale)
      return [resolved.slug, resolved.name]
    }),
  )

  return c.json({
    programs: programs.map((p) => {
      const resolved = resolveContent(p, locale)
      return {
        id: resolved.id,
        slug: resolved.slug,
        name: resolved.name,
        description: resolved.description,
        durationDays: resolved.durationDays,
        frameworksRequired: p.frameworksRequired,
        frameworkNames: p.frameworksRequired.map((s) => frameworkNameBySlug.get(s) ?? s),
        targetStage: resolved.targetStage,
        modeSequence: resolved.modeSequence.map((step) => ({
          ...step,
          modeName: modeNameBySlug.get(step.modeSlug) ?? step.modeSlug,
        })),
      }
    }),
  })
})

// ─── Enroll in Program ───────────────────────────────────────────────────────

programRoutes.post('/:slug/enroll', async (c) => {
  const userId = c.get('userId')
  const locale = c.get('locale')
  const slug = c.req.param('slug')
  const db = createDb(c.env.DB)

  const program = await db.query.trainingPrograms.findFirst({
    where: eq(trainingPrograms.slug, slug),
  })
  if (!program) return c.json({ error: 'Program not found' }, 404)

  // Check if already enrolled in an active program
  const existing = await db.query.userPrograms.findFirst({
    where: and(eq(userPrograms.userId, userId), eq(userPrograms.status, 'active')),
  })
  if (existing) return c.json({ error: 'Already enrolled in an active program' }, 400)

  const id = newId()
  await db.insert(userPrograms).values({
    id,
    userId,
    programId: program.id,
    status: 'active',
    startDate: new Date(),
    currentDay: 1,
    completedModes: [],
  })

  const resolvedProgram = resolveContent(program, locale)
  const firstStep = resolvedProgram.modeSequence[0] ?? null

  // Resolve mode name for the first step
  let firstMode: { modeSlug: string; description: string; modeName: string } | null = null
  if (firstStep) {
    const modeRow = await db.query.modes.findFirst({
      where: eq(modes.slug, firstStep.modeSlug),
    })
    const modeName = modeRow ? resolveContent(modeRow, locale).name : firstStep.modeSlug
    firstMode = { ...firstStep, modeName }
  }

  return c.json(
    {
      userProgram: { id, programSlug: slug, status: 'active', currentDay: 1 },
      firstMode,
    },
    201,
  )
})

// ─── Get Active Program ──────────────────────────────────────────────────────

programRoutes.get('/active', async (c) => {
  const userId = c.get('userId')
  const locale = c.get('locale')
  const db = createDb(c.env.DB)

  const userProgram = await db.query.userPrograms.findFirst({
    where: and(eq(userPrograms.userId, userId), eq(userPrograms.status, 'active')),
  })
  if (!userProgram) return c.json({ error: 'No active program' }, 404)

  const program = await db.query.trainingPrograms.findFirst({
    where: eq(trainingPrograms.id, userProgram.programId),
  })
  if (!program) return c.json({ error: 'Program not found' }, 404)

  const resolvedProgram = resolveContent(program, locale)

  // Batch-fetch translated mode names for the schedule
  const scheduleSlugs = [...new Set(resolvedProgram.modeSequence.map((s) => s.modeSlug))]
  const modeRows =
    scheduleSlugs.length > 0
      ? await db
          .select({ slug: modes.slug, name: modes.name, translations: modes.translations })
          .from(modes)
          .where(inArray(modes.slug, scheduleSlugs))
      : []
  const modeNameBySlug = new Map(
    modeRows.map((m) => {
      const resolved = resolveContent(m, locale)
      return [resolved.slug, resolved.name]
    }),
  )

  const startDate = userProgram.startDate
  const schedule = resolvedProgram.modeSequence.map((step) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + step.day - 1)
    return {
      day: step.day,
      date: date.toISOString().split('T')[0]!,
      modeSlug: step.modeSlug,
      modeName: modeNameBySlug.get(step.modeSlug) ?? step.modeSlug,
      description: step.description,
      completed: (userProgram.completedModes ?? []).includes(step.modeSlug),
    }
  })

  return c.json({
    program: {
      slug: resolvedProgram.slug,
      name: resolvedProgram.name,
      description: resolvedProgram.description,
      durationDays: resolvedProgram.durationDays,
    },
    userProgram: {
      id: userProgram.id,
      status: userProgram.status,
      currentDay: userProgram.currentDay,
      startDate: startDate.toISOString(),
    },
    schedule,
    metricsBaseline: userProgram.metricsSnapshot ?? {},
  })
})

// ─── Complete Program ────────────────────────────────────────────────────────

programRoutes.post('/active/complete', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  const userProgram = await db.query.userPrograms.findFirst({
    where: and(eq(userPrograms.userId, userId), eq(userPrograms.status, 'active')),
  })
  if (!userProgram) return c.json({ error: 'No active program' }, 404)

  await db
    .update(userPrograms)
    .set({
      status: 'completed',
      completedAt: new Date(),
    })
    .where(eq(userPrograms.id, userProgram.id))

  // Calculate before/after improvements
  const baseline = (userProgram.metricsSnapshot as Record<string, number>) ?? {}
  const currentHealth = await calculateHealth(db, userId)
  const currentScores: Record<string, number> = {}
  for (const cat of currentHealth.categories) {
    currentScores[cat.name] = cat.score
  }

  const improvements = Object.entries(baseline)
    .map(([metric, before]) => {
      const after = currentScores[metric] ?? before
      const delta = after - before
      return {
        metric,
        before,
        after,
        change: delta > 0 ? `+${delta}` : String(delta),
      }
    })
    .filter((imp) => imp.after !== imp.before)

  // Generate Alicia summary
  let aliciaSummary = ''
  try {
    const anthropic = createAnthropicClient(c.env)

    const summaryResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: `${PERSONALITY_PROMPT}\n\nSummarize a completed training program. Celebrate wins, note areas for growth, suggest next steps. 3-4 sentences. Be Alicia.`,
      messages: [
        {
          role: 'user',
          content: `Program completed. Improvements: ${JSON.stringify(improvements)}. Current health: ${JSON.stringify(currentScores)}.`,
        },
      ],
    })

    aliciaSummary = summaryResponse.content[0]?.type === 'text' ? summaryResponse.content[0].text : ''
  } catch {
    aliciaSummary =
      improvements.length > 0
        ? `You completed the program with ${improvements.length} metric(s) improved. Keep the momentum.`
        : 'Program completed. Run your next assessment to see where you stand.'
  }

  return c.json({
    completed: true,
    improvements,
    aliciaSummary,
  })
})

export { programRoutes }
