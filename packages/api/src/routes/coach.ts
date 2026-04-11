import type Anthropic from '@anthropic-ai/sdk'
import { coachMessageSchema } from '@synergy/shared'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { runAliciaLoop } from '../agents/alicia/loop.js'
import { CROSS_FRAMEWORK_PROMPT } from '../agents/alicia/prompts/cross-fw.js'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { getSurfacePrompt } from '../agents/alicia/prompts/surfaces.js'
import { coachConversations, modes, proactiveObservations } from '../db/schema.js'
import type { Env } from '../env.js'
import { createAnthropicClient } from '../lib/anthropic.js'
import { createDb } from '../lib/db.js'
import { resolveContent } from '../lib/i18n.js'
import { newId } from '../lib/id.js'

const coachRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

// ─── SSE Stream (all surfaces) ───────────────────────────────────────────────

coachRoutes.post('/stream', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const parsed = coachMessageSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const { message, conversationId, surface, locale } = parsed.data
    const db = createDb(c.env.DB)

    // Get Alicia DO stub via RPC — fully typed, no fetch() needed
    const aliciaId = c.env.ALICIA.idFromName(userId)
    const aliciaDO = c.env.ALICIA.get(aliciaId)

    // Initialize DO for this user
    await aliciaDO.init(userId)

    // Load existing conversation if provided
    if (conversationId) {
      aliciaDO.loadConversation(conversationId)
    }

    // Build system prompt from layers
    const LANGUAGE_NAMES: Record<string, string> = {
      fr: 'French',
      es: 'Spanish',
      pt: 'Portuguese',
      it: 'Italian',
      de: 'German',
      nl: 'Dutch',
    }
    const langInstruction =
      locale && locale !== 'en' && LANGUAGE_NAMES[locale]
        ? `\n\nIMPORTANT: Respond in ${LANGUAGE_NAMES[locale]}. Maintain your personality and coaching style in this language.`
        : ''
    const systemPrompt = `${PERSONALITY_PROMPT}\n\n${CROSS_FRAMEWORK_PROMPT}\n\n${getSurfacePrompt(surface)}${langInstruction}`

    // Get conversation history via RPC
    const historyMessages = await aliciaDO.getConversationHistory()

    // Build Anthropic messages from history + new message
    const anthropicMessages: Anthropic.Messages.MessageParam[] = [
      ...historyMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Create Anthropic client through AI Gateway (BYOK)
    const anthropic = createAnthropicClient(c.env)

    // SSE stream
    const encoder = new TextEncoder()
    const responseConversationId = conversationId ?? newId()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await runAliciaLoop({
            anthropic,
            db,
            userId,
            systemPrompt,
            messages: anthropicMessages,
            onTextChunk: (text) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`))
            },
            onToolCall: (name) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool_call', name })}\n\n`))
            },
          })

          // Persist conversation to Durable Object via RPC
          await aliciaDO.addUserMessage(message)
          if (result.fullResponse) {
            await aliciaDO.addAssistantMessage(result.fullResponse)
          }

          // Persist to D1 for conversation history
          const now = new Date()
          const nowTs = Date.now()
          const messagesJson = [
            ...anthropicMessages.map((m) => ({
              role: (m.role === 'assistant' ? 'alicia' : 'user') as 'user' | 'alicia',
              content: String(m.content),
              timestamp: nowTs,
            })),
            ...(result.fullResponse
              ? [{ role: 'alicia' as const, content: result.fullResponse, timestamp: nowTs }]
              : []),
          ]

          if (conversationId) {
            await db
              .update(coachConversations)
              .set({ messages: messagesJson, updatedAt: now })
              .where(and(eq(coachConversations.id, responseConversationId), eq(coachConversations.userId, userId)))
          } else {
            await db.insert(coachConversations).values({
              id: responseConversationId,
              userId,
              messages: messagesJson,
              context: {},
              createdAt: now,
              updatedAt: now,
            })
          }

          // Extract suggestions from tool calls
          const suggestions = result.toolsUsed.includes('suggest_mode')
            ? [{ label: 'View suggested mode', slug: 'validation' }]
            : []

          // Send done event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'done', conversationId: responseConversationId, suggestions })}\n\n`,
            ),
          )

          controller.close()
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`))
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
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── List Conversations ─────────────────────────────────────────────────────

coachRoutes.get('/conversations', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const conversations = await db
      .select()
      .from(coachConversations)
      .where(eq(coachConversations.userId, userId))
      .orderBy(desc(coachConversations.updatedAt))
      .limit(20)

    return c.json({
      conversations: conversations.map((conv) => {
        const msgs = conv.messages as Array<{ role: string; content: string }>
        const firstUserMsg = msgs.find((m) => m.role === 'user')
        return {
          id: conv.id,
          preview: firstUserMsg?.content.slice(0, 80) ?? 'New conversation',
          messageCount: msgs.length,
          updatedAt: conv.updatedAt.toISOString(),
        }
      }),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Conversation Messages ──────────────────────────────────────────────

coachRoutes.get('/conversations/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const conversationId = c.req.param('id')
    const db = createDb(c.env.DB)

    const conv = await db.query.coachConversations.findFirst({
      where: and(eq(coachConversations.id, conversationId), eq(coachConversations.userId, userId)),
    })

    if (!conv) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    return c.json({
      id: conv.id,
      messages: conv.messages as Array<{ role: string; content: string }>,
      updatedAt: conv.updatedAt.toISOString(),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Proactive Observations ──────────────────────────────────────────────

coachRoutes.get('/proactive', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const observations = await db
      .select()
      .from(proactiveObservations)
      .where(and(eq(proactiveObservations.userId, userId), eq(proactiveObservations.dismissed, false)))
      .orderBy(proactiveObservations.createdAt)

    // Resolve mode names for observations with suggestedModeSlug
    const locale = c.get('locale')
    const slugs = observations.map((o) => o.suggestedModeSlug).filter((s): s is string => !!s)
    const uniqueSlugs = [...new Set(slugs)]
    const modeRows = uniqueSlugs.length > 0 ? await db.select().from(modes).where(inArray(modes.slug, uniqueSlugs)) : []
    const modeNameBySlug = new Map(
      modeRows.map((m) => {
        const resolved = resolveContent(m, locale)
        return [resolved.slug, resolved.name]
      }),
    )

    return c.json({
      observations: observations.map((o) => ({
        id: o.id,
        triggerType: o.triggerType,
        title: o.title,
        message: o.message,
        suggestedModeSlug: o.suggestedModeSlug,
        suggestedModeName: o.suggestedModeSlug
          ? (modeNameBySlug.get(o.suggestedModeSlug) ?? o.suggestedModeSlug)
          : null,
        createdAt: o.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Dismiss Observation ─────────────────────────────────────────────────────

coachRoutes.post('/proactive/:id/dismiss', async (c) => {
  try {
    const userId = c.get('userId')
    const observationId = c.req.param('id')
    const db = createDb(c.env.DB)

    await db
      .update(proactiveObservations)
      .set({ dismissed: true })
      .where(and(eq(proactiveObservations.id, observationId), eq(proactiveObservations.userId, userId)))

    return c.json({ dismissed: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Act On Observation ──────────────────────────────────────────────────────

coachRoutes.post('/proactive/:id/act', async (c) => {
  try {
    const userId = c.get('userId')
    const observationId = c.req.param('id')
    const db = createDb(c.env.DB)

    await db
      .update(proactiveObservations)
      .set({ actedOn: true })
      .where(and(eq(proactiveObservations.id, observationId), eq(proactiveObservations.userId, userId)))

    return c.json({ actedOn: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Legacy message endpoint (non-streaming)
coachRoutes.post('/message', async (c) => {
  try {
    return c.json({ error: 'Use POST /api/coach/stream for all coaching interactions' }, 410)
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { coachRoutes }
