import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { HealthCard } from '../../components/dashboard/HealthCard'
import { NudgeCard } from '../../components/dashboard/NudgeCard'
import { ProgressRings } from '../../components/dashboard/ProgressRings'
import { useAuthStore } from '../../stores/auth'

export const Route = createFileRoute('/_auth/')({
  component: Dashboard,
})

interface HealthDashboard {
  categories: Array<{
    name: string
    score: number
    trend: 'improving' | 'stable' | 'declining'
    trendPeriods: number
    color: 'green' | 'yellow' | 'orange' | 'red'
    topMetrics: Array<{ name: string; value: number; unit: string }>
    recommendedModes: string[]
  }>
  overallScore: number
  biggestRisk: string
  lastUpdated: string
}

interface ProgressData {
  completion: { value: number; target: number; percentage: number }
  consistency: { streakWeeks: number; lastActiveWeek: string }
  growth: { score: number; trend: string; improvingMetrics: string[] }
}

function Dashboard() {
  const { t } = useTranslation()
  const { user, token } = useAuthStore()

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/health', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch health')
      return res.json() as Promise<HealthDashboard>
    },
  })

  const nudgesQuery = useQuery({
    queryKey: ['proactive'],
    queryFn: async () => {
      const res = await fetch('/api/coach/proactive', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        observations: Array<{
          id: string
          triggerType: string
          title: string
          message: string
          suggestedModeSlug: string | null
          suggestedModeName?: string | null
        }>
      }>
    },
  })

  const progressQuery = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch progress')
      return res.json() as Promise<ProgressData>
    },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="wave-entrance-1 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">
            {t('dashboard.welcomeBack', { name: user?.name })}
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {healthQuery.data?.biggestRisk ?? t('dashboard.healthGlance')}
          </p>
        </div>
        <Link to="/modes" className="neo-btn shadow-neo-button rounded-full px-6 py-3 text-sm font-semibold">
          {t('dashboard.browseModes')}
        </Link>
      </div>

      {/* Alicia's Nudges */}
      {nudgesQuery.data && nudgesQuery.data.observations.length > 0 && (
        <div className="wave-entrance-2 space-y-3">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('dashboard.fromAlicia')}
          </h2>
          {nudgesQuery.data.observations.map((obs) => (
            <NudgeCard
              key={obs.id}
              id={obs.id}
              triggerType={obs.triggerType}
              title={obs.title}
              message={obs.message}
              suggestedModeSlug={obs.suggestedModeSlug}
              suggestedModeName={obs.suggestedModeName}
            />
          ))}
        </div>
      )}

      {/* Progress Rings */}
      <div className="wave-entrance-3">
        {progressQuery.data ? (
          <ProgressRings
            completion={progressQuery.data.completion.percentage}
            consistency={progressQuery.data.consistency.streakWeeks}
            growth={progressQuery.data.growth.score}
          />
        ) : (
          <div className="wave-skeleton h-64 rounded-[2rem]" />
        )}
      </div>

      {/* Health Cards */}
      {healthQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="wave-skeleton h-44 rounded-[1.8rem]" />
          ))}
        </div>
      ) : healthQuery.data?.categories.length === 0 ? (
        <div className="wave-entrance-4 shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
          <p className="text-lg text-[var(--text-secondary)]">{t('dashboard.activateHint')}</p>
          <Link
            to="/modes"
            className="neo-btn shadow-neo-button mt-4 inline-block rounded-full px-8 py-3 font-semibold"
          >
            {t('common.getStarted')}
          </Link>
        </div>
      ) : (
        <div className="wave-entrance-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {healthQuery.data?.categories.map((cat) => (
            <HealthCard
              key={cat.name}
              name={cat.name}
              score={cat.score}
              trend={cat.trend}
              color={cat.color}
              topMetrics={cat.topMetrics}
            />
          ))}
        </div>
      )}
    </div>
  )
}
