import { z } from 'zod'

export const createSessionSchema = z.object({
  modeSlug: z.string().min(1),
  teamId: z.string().optional(),
})

export const updateSessionFieldSchema = z.object({
  fieldIndex: z.number().int().min(0),
  fieldData: z.unknown(),
})

export const completeSessionSchema = z.object({
  decision: z.enum(['persevere', 'pivot', 'experiment-again']).optional(),
})

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  teamId: z.string().nullable(),
  modeId: z.string(),
  status: z.enum(['in_progress', 'completed', 'abandoned']),
  fieldsData: z.record(z.string(), z.unknown()),
  currentFieldIndex: z.number().int().min(0),
  decision: z.enum(['persevere', 'pivot', 'experiment-again']).nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
})

export const sessionListQuerySchema = z.object({
  modeSlug: z.string().optional(),
  status: z.enum(['in_progress', 'completed', 'abandoned']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export const sessionCompletionResponseSchema = z.object({
  session: sessionSchema,
  metricsUpdated: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
      unit: z.string(),
    }),
  ),
  composabilitySuggestions: z.array(
    z.object({
      modeSlug: z.string(),
      reason: z.string(),
    }),
  ),
})

export type Session = z.infer<typeof sessionSchema>
export type CreateSession = z.infer<typeof createSessionSchema>
export type UpdateSessionField = z.infer<typeof updateSessionFieldSchema>
export type CompleteSession = z.infer<typeof completeSessionSchema>
