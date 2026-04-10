import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { trainingPrograms, userPrograms } from '../db/schema.js'
import type { Env } from '../env.js'
import { createAnthropicClient } from '../lib/anthropic.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { calculateHealth } from '../services/health.js'

const programRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── List Programs ───────────────────────────────────────────────────────────

programRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const programs = await db.select().from(trainingPrograms)

  return c.json({
    programs: programs.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      durationDays: p.durationDays,
      frameworksRequired: p.frameworksRequired,
      targetStage: p.targetStage,
      modeSequence: p.modeSequence,
    })),
  })
})

// ─── Enroll in Program ───────────────────────────────────────────────────────

programRoutes.post('/:slug/enroll', async (c) => {
  const userId = c.get('userId')
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

  return c.json(
    {
      userProgram: { id, programSlug: slug, status: 'active', currentDay: 1 },
      firstMode: program.modeSequence[0] ?? null,
    },
    201,
  )
})

// ─── Get Active Program ──────────────────────────────────────────────────────

programRoutes.get('/active', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  const userProgram = await db.query.userPrograms.findFirst({
    where: and(eq(userPrograms.userId, userId), eq(userPrograms.status, 'active')),
  })
  if (!userProgram) return c.json({ error: 'No active program' }, 404)

  const program = await db.query.trainingPrograms.findFirst({
    where: eq(trainingPrograms.id, userProgram.programId),
  })
  if (!program) return c.json({ error: 'Program not found' }, 404)

  const startDate = userProgram.startDate
  const schedule = program.modeSequence.map((step) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + step.day - 1)
    return {
      day: step.day,
      date: date.toISOString().split('T')[0]!,
      modeSlug: step.modeSlug,
      description: step.description,
      completed: (userProgram.completedModes ?? []).includes(step.modeSlug),
    }
  })

  return c.json({
    program: {
      slug: program.slug,
      name: program.name,
      description: program.description,
      durationDays: program.durationDays,
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
