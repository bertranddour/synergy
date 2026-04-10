import { z } from 'zod'

export const fieldDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['text', 'textarea', 'select', 'number', 'toggle', 'structured']),
  required: z.boolean().default(true),
  options: z.array(z.string()).optional(),
  example: z.string().optional(),
})

export const coachPromptSchema = z.object({
  fieldIndex: z.number().int().min(0),
  prompt: z.string(),
})

export const composabilityHookSchema = z.object({
  direction: z.enum(['feeds_into', 'receives_from']),
  modeSlug: z.string(),
  description: z.string(),
})

export const metricDefinitionSchema = z.object({
  name: z.string(),
  unit: z.enum(['count', 'percentage', 'days', 'hours', 'score']),
  extraction: z.string(),
})

export const modeSchema = z.object({
  id: z.string(),
  frameworkId: z.string(),
  slug: z.string(),
  name: z.string(),
  purpose: z.string(),
  trigger: z.string(),
  flowName: z.string(),
  fieldsSchema: z.array(fieldDefinitionSchema),
  aiCoachPrompts: z.array(coachPromptSchema),
  doneSignal: z.string(),
  metricsSchema: z.array(metricDefinitionSchema),
  composabilityHooks: z.array(composabilityHookSchema),
  timeEstimateMinutes: z.number().int().positive(),
  sortOrder: z.number().int().min(0),
})

export const modeListQuerySchema = z.object({
  framework: z.enum(['core', 'air', 'max', 'synergy']).optional(),
  recommended: z.coerce.boolean().optional(),
  search: z.string().optional(),
})

export const modeDetailSchema = modeSchema.extend({
  recentSessions: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['in_progress', 'completed', 'abandoned']),
      startedAt: z.string().datetime(),
      completedAt: z.string().datetime().nullable(),
    }),
  ),
})

export type Mode = z.infer<typeof modeSchema>
export type ModeDetail = z.infer<typeof modeDetailSchema>
export type FieldDefinition = z.infer<typeof fieldDefinitionSchema>
export type CoachPrompt = z.infer<typeof coachPromptSchema>
export type ComposabilityHook = z.infer<typeof composabilityHookSchema>
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>
