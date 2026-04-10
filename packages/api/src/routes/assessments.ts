import Anthropic from '@anthropic-ai/sdk'
import { assessmentListQuerySchema, startAssessmentSchema, submitAnswerSchema } from '@synergy/shared'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { assessments, frameworks } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'

const SCORING: Record<string, number> = { a: 5, b: 3, c: 1, d: 0 }

const LEVELS: Array<{ min: number; level: string }> = [
  { min: 30, level: 'running' },
  { min: 21, level: 'walking' },
  { min: 12, level: 'crawling' },
  { min: 0, level: 'standing-still' },
]

function getLevel(score: number): string {
  for (const { min, level } of LEVELS) {
    if (score >= min) return level
  }
  return 'standing-still'
}

const assessmentRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Start Assessment ────────────────────────────────────────────────────────

assessmentRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = startAssessmentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
  }

  const db = createDb(c.env.DB)
  const framework = await db.query.frameworks.findFirst({
    where: eq(frameworks.slug, parsed.data.frameworkSlug),
  })
  if (!framework) return c.json({ error: 'Framework not found' }, 404)

  const id = newId()
  await db.insert(assessments).values({
    id,
    userId,
    frameworkId: framework.id,
    status: 'in_progress',
    responses: [],
    startedAt: new Date(),
  })

  // Generate 7 scenarios for the framework
  const scenarios = generateScenarios(parsed.data.frameworkSlug)

  return c.json({ assessment: { id, frameworkSlug: parsed.data.frameworkSlug, status: 'in_progress' }, scenarios }, 201)
})

// ─── Submit Answer ───────────────────────────────────────────────────────────

assessmentRoutes.patch('/:id', async (c) => {
  const userId = c.get('userId')
  const assessmentId = c.req.param('id')
  const body = await c.req.json()
  const parsed = submitAnswerSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
  }

  const db = createDb(c.env.DB)
  const assessment = await db.query.assessments.findFirst({
    where: and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)),
  })
  if (!assessment) return c.json({ error: 'Assessment not found' }, 404)
  if (assessment.status !== 'in_progress') return c.json({ error: 'Assessment already completed' }, 400)

  const score = SCORING[parsed.data.answer] ?? 0
  const responses = [
    ...(assessment.responses ?? []),
    {
      scenarioId: parsed.data.scenarioId,
      answer: parsed.data.answer,
      score,
    },
  ]

  await db.update(assessments).set({ responses }).where(eq(assessments.id, assessmentId))

  return c.json({ assessment: { id: assessmentId }, scenariosRemaining: 7 - responses.length })
})

// ─── Complete Assessment ─────────────────────────────────────────────────────

assessmentRoutes.post('/:id/complete', async (c) => {
  const userId = c.get('userId')
  const assessmentId = c.req.param('id')
  const db = createDb(c.env.DB)

  const assessment = await db.query.assessments.findFirst({
    where: and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)),
  })
  if (!assessment) return c.json({ error: 'Assessment not found' }, 404)

  const responses = assessment.responses ?? []
  const totalScore = responses.reduce((sum, r) => sum + r.score, 0)
  const maxScore = 35
  const level = getLevel(totalScore) as 'standing-still' | 'crawling' | 'walking' | 'running' | 'flying'

  await db
    .update(assessments)
    .set({
      status: 'completed',
      totalScore,
      maxScore,
      level,
      completedAt: new Date(),
    })
    .where(eq(assessments.id, assessmentId))

  // Generate mode recommendations based on weak scenarios
  const weakScenarios = responses.filter((r) => r.score <= 1)
  const SCENARIO_MODE_MAP: Record<string, string> = {
    'core-1': 'validation',
    'core-2': 'validation',
    'core-3': 'insight-capture',
    'core-4': 'priority-stack',
    'core-5': 'validation',
    'core-6': 'delivery-check',
    'core-7': 'validation',
    'air-1': 'async-decision',
    'air-2': 'team-rhythm',
    'air-3': 'information-architecture',
    'air-4': 'package',
    'air-5': 'contribution-tracker',
    'air-6': 'async-decision',
    'air-7': 'culture-at-distance',
    'max-1': 'connection-map',
    'max-2': 'company-priority',
    'max-3': 'quality-matrix',
    'max-4': 'team-blueprint',
    'max-5': 'scaled-execution',
    'max-6': 'relationship-health',
    'max-7': 'dashboard',
    'syn-1': 'ai-onboarding',
    'syn-2': 'centaur-assessment',
    'syn-3': 'verification-ritual',
    'syn-4': 'knowledge-architecture',
    'syn-5': 'trust-calibration',
    'syn-6': 'ai-scaling',
    'syn-7': 'decision-protocol',
  }

  const recommendations = weakScenarios
    .map((r) => {
      const modeSlug = SCENARIO_MODE_MAP[r.scenarioId]
      return modeSlug ? { modeSlug, reason: `Scenario ${r.scenarioId} scored ${r.score}/5` } : null
    })
    .filter((r): r is { modeSlug: string; reason: string } => r !== null)
    .slice(0, 3)

  // Generate Alicia debrief via Claude
  let aliciaDebrief = ''
  try {
    const anthropic = new Anthropic({
      apiKey: c.env.ANTHROPIC_API_KEY,
      baseURL: c.env.AI_GATEWAY_ID
        ? `https://gateway.ai.cloudflare.com/v1/${c.env.CF_ACCOUNT_ID}/${c.env.AI_GATEWAY_ID}/anthropic`
        : undefined,
    })

    const debriefResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: `${PERSONALITY_PROMPT}\n\nYou are delivering assessment results. This is NOT a score card — this is a coaching debrief. Be honest, specific, and end with a concrete action.`,
      messages: [
        {
          role: 'user',
          content: `Assessment results: ${totalScore}/${maxScore} — ${level}. Weak areas: ${weakScenarios.map((s) => s.scenarioId).join(', ') || 'none'}. Strong areas: ${
            responses
              .filter((r) => r.score >= 5)
              .map((s) => s.scenarioId)
              .join(', ') || 'none'
          }. Deliver the debrief.`,
        },
      ],
    })

    aliciaDebrief = debriefResponse.content[0]?.type === 'text' ? debriefResponse.content[0].text : ''
  } catch {
    aliciaDebrief = `You scored ${totalScore}/${maxScore} — ${level.replace('-', ' ')}. ${
      weakScenarios.length > 0
        ? `Focus on the ${weakScenarios.length} weak areas identified.`
        : 'Solid across the board.'
    }`
  }

  return c.json({
    assessment: { id: assessmentId, totalScore, maxScore, level },
    score: totalScore,
    maxScore,
    level,
    recommendations,
    aliciaDebrief,
  })
})

// ─── List Assessments ────────────────────────────────────────────────────────

assessmentRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  const query = assessmentListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams))
  const params = query.success ? query.data : { limit: 10 }

  const result = await db
    .select()
    .from(assessments)
    .where(eq(assessments.userId, userId))
    .orderBy(desc(assessments.startedAt))
    .limit(params.limit)

  return c.json({
    assessments: result.map((a) => ({
      id: a.id,
      frameworkId: a.frameworkId,
      status: a.status,
      totalScore: a.totalScore,
      maxScore: a.maxScore,
      level: a.level,
      startedAt: a.startedAt.toISOString(),
      completedAt: a.completedAt?.toISOString() ?? null,
    })),
    total: result.length,
  })
})

// ─── Get Assessment Detail ───────────────────────────────────────────────────

assessmentRoutes.get('/:id', async (c) => {
  const userId = c.get('userId')
  const assessmentId = c.req.param('id')
  const db = createDb(c.env.DB)

  const assessment = await db.query.assessments.findFirst({
    where: and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)),
  })
  if (!assessment) return c.json({ error: 'Assessment not found' }, 404)

  return c.json({
    assessment: {
      id: assessment.id,
      frameworkId: assessment.frameworkId,
      status: assessment.status,
      totalScore: assessment.totalScore,
      maxScore: assessment.maxScore,
      level: assessment.level,
      responses: assessment.responses,
      startedAt: assessment.startedAt.toISOString(),
      completedAt: assessment.completedAt?.toISOString() ?? null,
    },
  })
})

// ─── Scenario Generator ──────────────────────────────────────────────────────

function generateScenarios(frameworkSlug: string) {
  const SCENARIOS: Record<
    string,
    Array<{
      id: string
      description: string
      options: { a: string; b: string; c: string; d: string }
    }>
  > = {
    core: [
      {
        id: 'core-1',
        description: 'You have a new product idea. Before building, you...',
        options: {
          a: 'Design a cheap experiment to test the riskiest assumption within a week.',
          b: 'Talk to 5 potential customers and look for patterns.',
          c: 'Build an MVP and see if anyone uses it.',
          d: 'Write a business plan and start building.',
        },
      },
      {
        id: 'core-2',
        description: 'Your experiment results are inconclusive — not clearly positive or negative. You...',
        options: {
          a: 'Redesign the experiment with a clearer success criteria and run it again.',
          b: 'Dig into the data to find segments where results were clearer.',
          c: 'Move forward cautiously with the original plan.',
          d: 'Abandon the idea and move to something else.',
        },
      },
      {
        id: 'core-3',
        description: 'A team member says "I think customers want feature X." You...',
        options: {
          a: 'Ask: what evidence do you have? Can we test this in 48 hours?',
          b: 'Ask them to write up the assumption and schedule a discussion.',
          c: 'Add it to the backlog and prioritize later.',
          d: 'Trust their instinct — they know the customer.',
        },
      },
      {
        id: 'core-4',
        description: 'You have 7 things competing for your attention this week. You...',
        options: {
          a: 'Force-rank all 7, pick the top 2, and explicitly name what you are NOT doing.',
          b: 'Evaluate each against impact and urgency, then pick the top 3.',
          c: 'Work on the most urgent ones first and fit in the rest.',
          d: 'Try to make progress on all 7 by giving each a little time.',
        },
      },
      {
        id: 'core-5',
        description: 'Your pricing was set 6 months ago based on competitor analysis. Since then...',
        options: {
          a: 'You have run pricing experiments and adjusted based on data.',
          b: 'You have gathered customer feedback on pricing and are planning a test.',
          c: "You have been meaning to revisit it but haven't gotten around to it.",
          d: "The price is working fine so you haven't thought about it.",
        },
      },
      {
        id: 'core-6',
        description: 'A deliverable is finished. Before shipping to the customer, you...',
        options: {
          a: 'Run it through a quality checklist and set up post-ship monitoring.',
          b: 'Have someone else review it against the requirements.',
          c: 'Skim it quickly and send it — speed matters.',
          d: 'Ship it. You will fix issues when customers report them.',
        },
      },
      {
        id: 'core-7',
        description: 'Your last three business decisions were made by...',
        options: {
          a: 'Testing hypotheses, reviewing data, and making evidence-based calls.',
          b: 'Discussing with the team and reaching consensus.',
          c: "Going with the highest-paid person's opinion.",
          d: 'Gut feel and experience.',
        },
      },
    ],
    air: [
      {
        id: 'air-1',
        description: 'A team member in another time zone needs a decision from you. You...',
        options: {
          a: 'Write a structured async decision document with options, deadline, and dissent protocol.',
          b: 'Send a detailed message explaining your thinking and ask for input.',
          c: 'Schedule a video call for the next overlapping hour.',
          d: 'Reply quickly with your decision to unblock them.',
        },
      },
      {
        id: 'air-2',
        description: 'Your team spends 15+ hours per week in meetings. You...',
        options: {
          a: 'Audit every meeting, kill half, convert the rest to async packages.',
          b: 'Ask team leads to reduce meetings by 30% this month.',
          c: 'Declare one meeting-free day per week.',
          d: 'Meetings are necessary — the team needs face time.',
        },
      },
      {
        id: 'air-3',
        description: "New team members consistently can't find key documents. You...",
        options: {
          a: 'Map all information to canonical locations and test findability with new hires.',
          b: 'Create an onboarding guide with links to important documents.',
          c: "Tell them to ask in Slack when they can't find something.",
          d: 'The docs are there — they just need to search better.',
        },
      },
      {
        id: 'air-4',
        description: 'You need to share project results with stakeholders. You...',
        options: {
          a: 'Package a self-contained update with context, key points, decision needed, and deadline.',
          b: 'Write a detailed report and share it in the team channel.',
          c: 'Present it in the next meeting.',
          d: 'Send a quick summary in chat.',
        },
      },
      {
        id: 'air-5',
        description: 'A remote team member does great mentoring work that nobody sees. You...',
        options: {
          a: 'Track 5 contribution types (delivery, mentoring, docs, process, unblocking) and recognize all.',
          b: 'Mention their mentoring in the next team meeting.',
          c: 'Note it in their performance review.',
          d: 'Good work speaks for itself.',
        },
      },
      {
        id: 'air-6',
        description: 'Two team members disagree on an approach. In a remote setting, you...',
        options: {
          a: 'Have them write structured proposals, set a deadline, and follow the dissent protocol.',
          b: 'Get them on a video call to talk it through.',
          c: 'Make the decision yourself to avoid conflict.',
          d: 'Let them figure it out between themselves.',
        },
      },
      {
        id: 'air-7',
        description: "Your distributed team's culture feels thin. You...",
        options: {
          a: 'Define observable behaviors, rituals, conflict protocol, and trust signals.',
          b: 'Schedule more casual virtual hangouts.',
          c: 'Write a culture document and share it.',
          d: "Culture happens naturally — you can't force it.",
        },
      },
    ],
    max: [
      {
        id: 'max-1',
        description: 'Your 80-person company has 6 teams that barely talk to each other. You...',
        options: {
          a: 'Map all team-to-team connections, rate quality (smooth/friction/broken), fix bottlenecks.',
          b: 'Create cross-team channels and schedule regular sync meetings.',
          c: 'Ask team leads to coordinate better.',
          d: 'Teams should focus on their own work — too much coordination slows things down.',
        },
      },
      {
        id: 'max-2',
        description: 'The company has 12 "top priorities." You...',
        options: {
          a: 'Force-rank to 3-5, translate to team-level goals, and kill the rest explicitly.',
          b: 'Group them into themes and assign each theme to a team.',
          c: 'Ask each team to pick their top 3 from the list.',
          d: '12 priorities reflect the complexity of the business.',
        },
      },
      {
        id: 'max-3',
        description: 'Quality varies wildly across teams. You...',
        options: {
          a: 'Define company-wide quality standards plus team-specific ones, with measurement.',
          b: 'Create a quality review process for all deliverables.',
          c: 'Have the best team share their practices.',
          d: 'Each team knows their own quality bar.',
        },
      },
      {
        id: 'max-4',
        description: 'A new team needs to be created. You...',
        options: {
          a: 'Define mission, members, decision authority, cadence, and quality standards upfront.',
          b: 'Assign a lead, give them a goal, and let them figure out the rest.',
          c: 'Move people from other teams and set a deadline.',
          d: 'Start with the project and formalize the team later.',
        },
      },
      {
        id: 'max-5',
        description: 'Cross-team delivery is consistently late. You...',
        options: {
          a: 'Map dependencies, make them visible, assign owners for each handoff.',
          b: 'Add buffer time to all cross-team projects.',
          c: 'Escalate to leadership when things are late.',
          d: 'Push teams to be more accountable.',
        },
      },
      {
        id: 'max-6',
        description: 'Two teams have a friction-filled relationship. You...',
        options: {
          a: 'Diagnose pain generators, expectations gaps, and agree on a fix protocol.',
          b: 'Get both team leads in a room to talk it out.',
          c: 'Reorganize to reduce their interaction.',
          d: 'Some friction is normal at this size.',
        },
      },
      {
        id: 'max-7',
        description: 'Your dashboard shows performance metrics but people seem burnt out. You...',
        options: {
          a: 'Add dynamics metrics: learning rate, collaboration score, commitment, fun.',
          b: 'Run a team survey about wellbeing.',
          c: 'Give everyone a day off.',
          d: 'Performance is strong — they can handle it.',
        },
      },
    ],
    synergy: [
      {
        id: 'syn-1',
        description: 'You start using AI for business tasks. Your first step is...',
        options: {
          a: 'Define AI role, knowledge sources, access boundaries, success metrics, and review cadence.',
          b: 'Give the AI access to your docs and start experimenting.',
          c: 'Try it for one specific task and see how it goes.',
          d: 'Use it when you need it — no formal setup needed.',
        },
      },
      {
        id: 'syn-2',
        description: 'You need to decide which tasks AI should handle. You...',
        options: {
          a: 'Map every task as human-led, AI-led, or centaur, with evidence for each.',
          b: 'Start with low-risk tasks and expand based on results.',
          c: 'Let AI try everything and pull back where it fails.',
          d: 'AI should handle repetitive tasks, humans do creative work.',
        },
      },
      {
        id: 'syn-3',
        description: 'AI produces a report that will go to a client. You...',
        options: {
          a: 'Classify risk level, apply appropriate review protocol (deep for high-stakes).',
          b: 'Read through it carefully before sending.',
          c: 'Skim the key numbers and send if they look right.',
          d: 'The AI is good — send it.',
        },
      },
      {
        id: 'syn-4',
        description: 'Your AI keeps asking for the same context every session. You...',
        options: {
          a: 'Build a knowledge architecture: persistent context, update triggers, access patterns.',
          b: 'Create a template with common context to paste each time.',
          c: 'Give it longer prompts with more background.',
          d: 'That is just how AI works.',
        },
      },
      {
        id: 'syn-5',
        description: 'A team member says "I don\'t trust the AI\'s recommendations." You...',
        options: {
          a: 'Check evidence: is this over-trust, calibrated distrust, or untested? Adjust based on data.',
          b: 'Show them examples where AI was accurate.',
          c: "Respect their judgment and don't force it.",
          d: 'They will get used to it over time.',
        },
      },
      {
        id: 'syn-6',
        description: 'AI collaboration works for you personally. To scale it to the team, you...',
        options: {
          a: 'Plan the path: standardize what works, customize per team, assess risks.',
          b: 'Share your setup and let others adapt it.',
          c: 'Get everyone access and let them figure it out.',
          d: 'It is a personal productivity tool — no need to scale.',
        },
      },
      {
        id: 'syn-7',
        description: 'AI makes a decision that turns out to be wrong. You...',
        options: {
          a: 'Review the decision protocol: did override conditions exist? Update the protocol.',
          b: "Document what went wrong and adjust the AI's instructions.",
          c: 'Override it manually and move on.',
          d: 'Reduce AI authority across the board.',
        },
      },
    ],
  }

  return SCENARIOS[frameworkSlug] ?? SCENARIOS.core!
}

export { assessmentRoutes }
