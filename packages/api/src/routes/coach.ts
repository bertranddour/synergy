import { Hono } from 'hono'
import Anthropic from '@anthropic-ai/sdk'
import { coachMessageSchema } from '@synergy/shared'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { CROSS_FRAMEWORK_PROMPT } from '../agents/alicia/prompts/cross-fw.js'
import { getSurfacePrompt } from '../agents/alicia/prompts/surfaces.js'
// buildModeCoachPrompt will be used in Step 3.6 for in-mode coaching
import { runAliciaLoop } from '../agents/alicia/loop.js'
import { AliciaAgent } from '../agents/alicia/agent.js'
import { eq, and } from 'drizzle-orm'
import { proactiveObservations } from '../db/schema.js'

const coachRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── SSE Stream (all surfaces) ───────────────────────────────────────────────

coachRoutes.post('/stream', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = coachMessageSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
  }

  const { message, conversationId, surface } = parsed.data
  const db = createDb(c.env.DB)

  // Get or create Alicia DO instance for this user
  const aliciaId = c.env.ALICIA.idFromName(userId)
  const aliciaDO = c.env.ALICIA.get(aliciaId) as unknown as AliciaAgent

  // Initialize DO if needed
  await aliciaDO.fetch(new Request('http://internal/init', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }))

  // Load existing conversation if provided
  if (conversationId) {
    await aliciaDO.fetch(new Request(`http://internal/load?id=${conversationId}`, {
      method: 'POST',
    }))
  }

  // Build system prompt from layers
  let systemPrompt = PERSONALITY_PROMPT + '\n\n' + CROSS_FRAMEWORK_PROMPT + '\n\n' + getSurfacePrompt(surface)

  // Get conversation history from DO
  const historyRes = await aliciaDO.fetch(new Request('http://internal/history'))
  const history = await historyRes.json() as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  // Build Anthropic messages from history + new message
  const anthropicMessages: Anthropic.Messages.MessageParam[] = [
    ...history.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ]

  // Create Anthropic client through AI Gateway
  const anthropic = new Anthropic({
    apiKey: c.env.ANTHROPIC_API_KEY,
    baseURL: c.env.AI_GATEWAY_ID
      ? `https://gateway.ai.cloudflare.com/v1/${c.env.CF_ACCOUNT_ID}/${c.env.AI_GATEWAY_ID}/anthropic`
      : undefined,
  })

  // SSE stream
  const encoder = new TextEncoder()
  const responseConversationId = conversationId ?? newId()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await runAliciaLoop({
          anthropic,
          db,
          userId,
          systemPrompt,
          messages: anthropicMessages,
          onTextChunk: (text) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`),
            )
          },
          onToolCall: (name) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'tool_call', name })}\n\n`),
            )
          },
        })

        // Send done event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', conversationId: responseConversationId })}\n\n`),
        )

        controller.close()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
})

// ─── Get Proactive Observations ──────────────────────────────────────────────

coachRoutes.get('/proactive', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  const observations = await db
    .select()
    .from(proactiveObservations)
    .where(and(
      eq(proactiveObservations.userId, userId),
      eq(proactiveObservations.dismissed, false),
    ))
    .orderBy(proactiveObservations.createdAt)

  return c.json({
    observations: observations.map((o) => ({
      id: o.id,
      triggerType: o.triggerType,
      title: o.title,
      message: o.message,
      suggestedModeSlug: o.suggestedModeSlug,
      createdAt: o.createdAt.toISOString(),
    })),
  })
})

// ─── Dismiss Observation ─────────────────────────────────────────────────────

coachRoutes.post('/proactive/:id/dismiss', async (c) => {
  const userId = c.get('userId')
  const observationId = c.req.param('id')
  const db = createDb(c.env.DB)

  await db
    .update(proactiveObservations)
    .set({ dismissed: true })
    .where(and(
      eq(proactiveObservations.id, observationId),
      eq(proactiveObservations.userId, userId),
    ))

  return c.json({ dismissed: true })
})

// ─── Act On Observation ──────────────────────────────────────────────────────

coachRoutes.post('/proactive/:id/act', async (c) => {
  const userId = c.get('userId')
  const observationId = c.req.param('id')
  const db = createDb(c.env.DB)

  await db
    .update(proactiveObservations)
    .set({ actedOn: true })
    .where(and(
      eq(proactiveObservations.id, observationId),
      eq(proactiveObservations.userId, userId),
    ))

  return c.json({ actedOn: true })
})

// Legacy message endpoint (non-streaming)
coachRoutes.post('/message', async (c) => {
  return c.json({ error: 'Use POST /api/coach/stream for all coaching interactions' }, 410)
})

export { coachRoutes }
