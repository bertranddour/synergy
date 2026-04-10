import { eq, and, desc, gte } from 'drizzle-orm'
import type { Database } from '../lib/db.js'
import { metrics, userFrameworks, frameworks } from '../db/schema.js'

export interface HealthCategory {
  name: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
  trendPeriods: number
  color: 'green' | 'yellow' | 'orange' | 'red'
  topMetrics: Array<{ name: string; value: number; unit: string }>
  recommendedModes: string[]
}

/** Map health categories to the frameworks that feed them */
const CATEGORY_FRAMEWORK_MAP: Record<string, string[]> = {
  'validation': ['core'],
  'operational': ['core', 'max'],
  'team': ['air'],
  'scaling': ['max'],
  'ai-collaboration': ['synergy'],
}

/** Mode recommendations per health category */
const CATEGORY_MODE_RECOMMENDATIONS: Record<string, string[]> = {
  'validation': ['validation', 'insight-capture', 'business-engine'],
  'operational': ['execution-tracker', 'delivery-check', 'priority-stack'],
  'team': ['team-rhythm', 'package', 'async-decision'],
  'scaling': ['connection-map', 'company-priority', 'org-map'],
  'ai-collaboration': ['ai-onboarding', 'centaur-assessment', 'trust-calibration'],
}

function scoreToColor(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score >= 70) return 'green'
  if (score >= 40) return 'yellow'
  if (score >= 20) return 'orange'
  return 'red'
}

/**
 * Calculate health dashboard for a user.
 * Only shows categories for activated frameworks.
 */
export async function calculateHealth(
  db: Database,
  userId: string,
): Promise<{
  categories: HealthCategory[]
  overallScore: number
  biggestRisk: string
  lastUpdated: string
}> {
  // Get active framework slugs
  const activeFrameworkRows = await db
    .select({ slug: frameworks.slug })
    .from(userFrameworks)
    .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
    .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.active, true)))

  const activeSlugs = new Set<string>(activeFrameworkRows.map((f) => f.slug))

  // Determine which categories to show
  const activeCategories = Object.entries(CATEGORY_FRAMEWORK_MAP)
    .filter(([_, fws]) => fws.some((fw) => activeSlugs.has(fw)))
    .map(([cat]) => cat)

  if (activeCategories.length === 0) {
    return {
      categories: [],
      overallScore: 0,
      biggestRisk: 'No frameworks activated yet.',
      lastUpdated: new Date().toISOString(),
    }
  }

  // Get recent metrics for this user (last 90 days)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const recentMetrics = await db
    .select()
    .from(metrics)
    .where(and(
      eq(metrics.userId, userId),
      gte(metrics.recordedAt, ninetyDaysAgo),
    ))
    .orderBy(desc(metrics.recordedAt))

  // Build category scores
  const categories: HealthCategory[] = activeCategories.map((categoryName) => {
    const categoryMetrics = recentMetrics.filter((m) => m.category === categoryName)

    // Calculate score (average of metric values, normalized to 0-100)
    let score = 0
    const topMetrics: Array<{ name: string; value: number; unit: string }> = []

    if (categoryMetrics.length > 0) {
      // Group by metric name, take latest value
      const latestByName = new Map<string, typeof categoryMetrics[0]>()
      for (const m of categoryMetrics) {
        if (!latestByName.has(m.name)) {
          latestByName.set(m.name, m)
        }
      }

      const values = Array.from(latestByName.values())
      score = Math.min(100, Math.round(
        values.reduce((sum, m) => sum + Math.min(100, m.value), 0) / values.length,
      ))

      topMetrics.push(...values.slice(0, 5).map((m) => ({
        name: m.name,
        value: m.value,
        unit: m.unit,
      })))
    }

    return {
      name: categoryName,
      score,
      trend: 'stable' as const,
      trendPeriods: 0,
      color: scoreToColor(score),
      topMetrics,
      recommendedModes: CATEGORY_MODE_RECOMMENDATIONS[categoryName] ?? [],
    }
  })

  const overallScore = categories.length > 0
    ? Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length)
    : 0

  const lowestCategory = categories.reduce(
    (lowest, c) => (c.score < lowest.score ? c : lowest),
    categories[0]!,
  )

  return {
    categories,
    overallScore,
    biggestRisk: categories.length > 0
      ? `${lowestCategory.name} health is your weakest area at ${lowestCategory.score}/100.`
      : 'Complete some modes to start tracking health.',
    lastUpdated: new Date().toISOString(),
  }
}
