import { z } from 'zod'

export const healthCategorySchema = z.object({
  name: z.enum(['validation', 'operational', 'team', 'scaling', 'ai-collaboration']),
  score: z.number().min(0).max(100),
  trend: z.enum(['improving', 'stable', 'declining']),
  trendPeriods: z.number().int().min(0),
  color: z.enum(['green', 'yellow', 'orange', 'red']),
  topMetrics: z.array(z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
  })),
  recommendedModes: z.array(z.string()),
})

export const healthDashboardSchema = z.object({
  categories: z.array(healthCategorySchema),
  overallScore: z.number().min(0).max(100),
  biggestRisk: z.string(),
  lastUpdated: z.string().datetime(),
})

export const healthDetailSchema = z.object({
  category: z.enum(['validation', 'operational', 'team', 'scaling', 'ai-collaboration']),
  score: z.number().min(0).max(100),
  trend: z.enum(['improving', 'stable', 'declining']),
  metrics: z.array(z.object({
    name: z.string(),
    currentValue: z.number(),
    previousValue: z.number(),
    unit: z.string(),
    trend: z.enum(['improving', 'stable', 'declining']),
    sparkline: z.array(z.number()),
  })),
  recentSessions: z.array(z.object({
    id: z.string(),
    modeSlug: z.string(),
    completedAt: z.string().datetime(),
  })),
  recommendations: z.array(z.string()),
})

export type HealthCategory = z.infer<typeof healthCategorySchema>
export type HealthDashboard = z.infer<typeof healthDashboardSchema>
export type HealthDetail = z.infer<typeof healthDetailSchema>
