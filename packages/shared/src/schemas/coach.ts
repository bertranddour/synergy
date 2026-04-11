import { z } from 'zod'

export const coachMessageSchema = z.object({
  message: z.string().min(1).max(10000),
  conversationId: z.string().optional(),
  sessionId: z.string().optional(),
  surface: z.enum(['dashboard', 'mode-runner', 'chat', 'assessment', 'composability']),
  locale: z.enum(['en', 'fr', 'es', 'pt', 'it', 'de', 'nl']).optional(),
})

export const coachResponseSchema = z.object({
  reply: z.string(),
  conversationId: z.string(),
  suggestedActions: z.array(
    z.object({
      type: z.enum(['mode', 'assess', 'review']),
      slug: z.string(),
      reason: z.string(),
    }),
  ),
})

export const proactiveObservationSchema = z.object({
  id: z.string(),
  triggerType: z.enum([
    'stale-assumption',
    'procrastination',
    'health-decline',
    'framework-readiness',
    'missing-context',
  ]),
  title: z.string(),
  message: z.string(),
  suggestedModeSlug: z.string().nullable(),
  createdAt: z.string().datetime(),
})

/** SSE event types streamed from /api/coach/stream */
export const sseTextEventSchema = z.object({
  type: z.literal('text'),
  content: z.string(),
})

export const sseToolCallEventSchema = z.object({
  type: z.literal('tool_call'),
  name: z.string(),
})

export const sseDoneEventSchema = z.object({
  type: z.literal('done'),
  conversationId: z.string(),
  suggestions: z
    .array(
      z.object({
        label: z.string(),
        slug: z.string(),
      }),
    )
    .optional(),
})

export const sseErrorEventSchema = z.object({
  type: z.literal('error'),
  message: z.string(),
})

export const sseEventSchema = z.discriminatedUnion('type', [
  sseTextEventSchema,
  sseToolCallEventSchema,
  sseDoneEventSchema,
  sseErrorEventSchema,
])

export type CoachMessage = z.infer<typeof coachMessageSchema>
export type CoachResponse = z.infer<typeof coachResponseSchema>
export type ProactiveObservation = z.infer<typeof proactiveObservationSchema>
export type SSEEvent = z.infer<typeof sseEventSchema>
