import { and, desc, eq, gte, lt } from 'drizzle-orm'
import { frameworks, metrics, userFrameworks } from '../db/schema.js'
import type { Database } from '../lib/db.js'

export interface HealthCategory {
  name: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
  trendPeriods: number
  color: 'green' | 'yellow' | 'orange' | 'red'
  topMetrics: Array<{ name: string; value: number; unit: string }>
  recommendedModes: string[]
}

const CATEGORY_FRAMEWORK_MAP: Record<string, string[]> = {
  validation: ['core'],
  operational: ['core', 'max'],
  team: ['air'],
  scaling: ['max'],
  'ai-collaboration': ['synergy'],
}

const CATEGORY_MODE_RECOMMENDATIONS: Record<string, string[]> = {
  validation: ['validation', 'insight-capture', 'business-engine'],
  operational: ['execution-tracker', 'delivery-check', 'priority-stack'],
  team: ['team-rhythm', 'package', 'async-decision'],
  scaling: ['connection-map', 'company-priority', 'org-map'],
  'ai-collaboration': ['ai-onboarding', 'centaur-assessment', 'trust-calibration'],
}

function scoreToColor(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score >= 70) return 'green'
  if (score >= 40) return 'yellow'
  if (score >= 20) return 'orange'
  return 'red'
}

function calculateScoreFromMetrics(
  categoryMetrics: Array<{ name: string; value: number; unit: string; recordedAt: Date }>,
): { score: number; topMetrics: Array<{ name: string; value: number; unit: string }> } {
  if (categoryMetrics.length === 0) return { score: 0, topMetrics: [] }

  const latestByName = new Map<string, (typeof categoryMetrics)[0]>()
  for (const m of categoryMetrics) {
    if (!latestByName.has(m.name)) {
      latestByName.set(m.name, m)
    }
  }

  const values = Array.from(latestByName.values())
  const score = Math.min(100, Math.round(values.reduce((sum, m) => sum + Math.min(100, m.value), 0) / values.length))
  const topMetrics = values.slice(0, 5).map((m) => ({ name: m.name, value: m.value, unit: m.unit }))

  return { score, topMetrics }
}

/**
 * Calculate trend by comparing current period score to previous period score.
 * Improving: current > previous + 5
 * Declining: current < previous - 5
 * Stable: within ±5
 */
function determineTrend(currentScore: number, previousScore: number): 'improving' | 'stable' | 'declining' {
  const delta = currentScore - previousScore
  if (delta > 5) return 'improving'
  if (delta < -5) return 'declining'
  return 'stable'
}

export async function calculateHealth(
  db: Database,
  userId: string,
): Promise<{
  categories: HealthCategory[]
  overallScore: number
  biggestRisk: string
  lastUpdated: string
}> {
  const activeFrameworkRows = await db
    .select({ slug: frameworks.slug })
    .from(userFrameworks)
    .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
    .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.active, true)))

  const activeSlugs = new Set<string>(activeFrameworkRows.map((f) => f.slug))

  const activeCategories = Object.entries(CATEGORY_FRAMEWORK_MAP)
    .filter(([, fws]) => fws.some((fw) => activeSlugs.has(fw)))
    .map(([cat]) => cat)

  if (activeCategories.length === 0) {
    return {
      categories: [],
      overallScore: 0,
      biggestRisk: 'No frameworks activated yet.',
      lastUpdated: new Date().toISOString(),
    }
  }

  // Current period: last 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Current period metrics
  const currentMetrics = await db
    .select()
    .from(metrics)
    .where(and(eq(metrics.userId, userId), gte(metrics.recordedAt, thirtyDaysAgo)))
    .orderBy(desc(metrics.recordedAt))

  // Previous period metrics (30-60 days ago)
  const previousMetrics = await db
    .select()
    .from(metrics)
    .where(
      and(eq(metrics.userId, userId), gte(metrics.recordedAt, sixtyDaysAgo), lt(metrics.recordedAt, thirtyDaysAgo)),
    )
    .orderBy(desc(metrics.recordedAt))

  const categories: HealthCategory[] = activeCategories.map((categoryName) => {
    const currentCategoryMetrics = currentMetrics.filter((m) => m.category === categoryName)
    const previousCategoryMetrics = previousMetrics.filter((m) => m.category === categoryName)

    const { score, topMetrics } = calculateScoreFromMetrics(currentCategoryMetrics)
    const { score: previousScore } = calculateScoreFromMetrics(previousCategoryMetrics)

    const trend = previousCategoryMetrics.length > 0 ? determineTrend(score, previousScore) : 'stable'

    return {
      name: categoryName,
      score,
      trend,
      trendPeriods: previousCategoryMetrics.length > 0 ? 1 : 0,
      color: scoreToColor(score),
      topMetrics,
      recommendedModes: CATEGORY_MODE_RECOMMENDATIONS[categoryName] ?? [],
    }
  })

  const overallScore =
    categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length) : 0

  const lowestCategory = categories.reduce((lowest, c) => (c.score < lowest.score ? c : lowest), categories[0]!)

  return {
    categories,
    overallScore,
    biggestRisk:
      categories.length > 0
        ? `${lowestCategory.name} health is your weakest area at ${lowestCategory.score}/100.`
        : 'Complete some modes to start tracking health.',
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Get sparkline data for a specific metric (last 12 data points).
 */
export async function getMetricSparkline(db: Database, userId: string, metricName: string): Promise<number[]> {
  const results = await db
    .select({ value: metrics.value })
    .from(metrics)
    .where(and(eq(metrics.userId, userId), eq(metrics.name, metricName)))
    .orderBy(desc(metrics.recordedAt))
    .limit(12)

  return results.map((r) => r.value).reverse()
}
