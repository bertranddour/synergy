import { z } from 'zod'

export const progressRingsSchema = z.object({
  completion: z.object({
    value: z.number().int().min(0),
    target: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
  }),
  consistency: z.object({
    streakWeeks: z.number().int().min(0),
    lastActiveWeek: z.string(),
  }),
  growth: z.object({
    score: z.number().min(0).max(100),
    trend: z.enum(['improving', 'stable', 'declining']),
    improvingMetrics: z.array(z.string()),
  }),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    type: z.enum(['weekly', 'monthly']),
  }),
})

export const progressHistoryQuerySchema = z.object({
  period: z.enum(['weekly', 'monthly']).default('weekly'),
  limit: z.coerce.number().int().positive().default(12),
})

export const progressHistoryEntrySchema = z.object({
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  completion: z.number().min(0).max(100),
  consistency: z.number().int().min(0),
  growth: z.number().min(0).max(100),
  modesCompleted: z.number().int().min(0),
})

export const progressHistorySchema = z.object({
  history: z.array(progressHistoryEntrySchema),
})

export type ProgressRings = z.infer<typeof progressRingsSchema>
export type ProgressHistoryEntry = z.infer<typeof progressHistoryEntrySchema>
