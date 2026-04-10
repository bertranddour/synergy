import { z } from 'zod'

export const startAssessmentSchema = z.object({
  frameworkSlug: z.enum(['core', 'air', 'max', 'synergy']),
})

export const submitAnswerSchema = z.object({
  scenarioId: z.string().min(1),
  answer: z.enum(['a', 'b', 'c', 'd']),
})

export const scenarioSchema = z.object({
  id: z.string(),
  description: z.string(),
  options: z.object({
    a: z.string(),
    b: z.string(),
    c: z.string(),
    d: z.string(),
  }),
})

export const assessmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  frameworkId: z.string(),
  status: z.enum(['in_progress', 'completed']),
  responses: z.array(z.object({
    scenarioId: z.string(),
    answer: z.enum(['a', 'b', 'c', 'd']),
    score: z.number().int().min(0).max(5),
  })),
  totalScore: z.number().int().nullable(),
  maxScore: z.number().int().nullable(),
  level: z.enum(['standing-still', 'crawling', 'walking', 'running', 'flying']).nullable(),
  recommendations: z.array(z.string()).nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
})

export const assessmentCompletionSchema = z.object({
  assessment: assessmentSchema,
  score: z.number().int(),
  maxScore: z.number().int(),
  level: z.enum(['standing-still', 'crawling', 'walking', 'running', 'flying']),
  recommendations: z.array(z.object({
    modeSlug: z.string(),
    reason: z.string(),
  })),
  aliciaDebrief: z.string(),
})

export const assessmentListQuerySchema = z.object({
  frameworkSlug: z.enum(['core', 'air', 'max', 'synergy']).optional(),
  limit: z.coerce.number().int().positive().default(10),
})

export type Assessment = z.infer<typeof assessmentSchema>
export type Scenario = z.infer<typeof scenarioSchema>
export type AssessmentCompletion = z.infer<typeof assessmentCompletionSchema>
