import { z } from 'zod'

export const trainingProgramSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  durationDays: z.number().int().positive(),
  frameworksRequired: z.array(z.enum(['core', 'air', 'max', 'synergy'])),
  modeSequence: z.array(z.object({
    day: z.number().int().positive(),
    modeSlug: z.string(),
    description: z.string(),
  })),
  targetStage: z.enum(['solo', 'small-team', 'growing', 'scaling']).nullable(),
})

export const userProgramSchema = z.object({
  id: z.string(),
  userId: z.string(),
  programId: z.string(),
  status: z.enum(['active', 'completed', 'paused', 'abandoned']),
  startDate: z.string().datetime(),
  currentDay: z.number().int().positive(),
  completedModes: z.array(z.string()),
  metricsSnapshot: z.record(z.string(), z.number()).nullable(),
  completedAt: z.string().datetime().nullable(),
})

export const programListQuerySchema = z.object({
  stage: z.enum(['solo', 'small-team', 'growing', 'scaling']).optional(),
  framework: z.enum(['core', 'air', 'max', 'synergy']).optional(),
})

export const enrollProgramSchema = z.object({
  programSlug: z.string().min(1),
})

export const activeProgramSchema = z.object({
  program: trainingProgramSchema,
  userProgram: userProgramSchema,
  schedule: z.array(z.object({
    day: z.number().int().positive(),
    date: z.string(),
    modeSlug: z.string(),
    completed: z.boolean(),
  })),
  metricsBaseline: z.record(z.string(), z.number()),
})

export const programCompletionSchema = z.object({
  program: trainingProgramSchema,
  metricsBaseline: z.record(z.string(), z.number()),
  metricsFinal: z.record(z.string(), z.number()),
  improvements: z.array(z.object({
    metric: z.string(),
    before: z.number(),
    after: z.number(),
    change: z.string(),
  })),
  aliciaSummary: z.string(),
})

export type TrainingProgram = z.infer<typeof trainingProgramSchema>
export type UserProgram = z.infer<typeof userProgramSchema>
export type ActiveProgram = z.infer<typeof activeProgramSchema>
