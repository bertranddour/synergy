import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SparklineChart } from '../../../components/dashboard/SparklineChart'
import { Icon, type IconName } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/health/$category')({
  component: HealthDetail,
})

const TREND_ICONS: Record<string, IconName> = {
  improving: 'trend-up',
  stable: 'equals',
  declining: 'trend-down',
}

const CATEGORY_COLORS: Record<string, string> = {
  validation: 'var(--color-core)',
  operational: 'var(--color-core)',
  team: 'var(--color-air)',
  scaling: 'var(--color-max)',
  'ai-collaboration': 'var(--color-synergy)',
}

interface HealthDetailData {
  category: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
  metrics: Array<{
    name: string
    currentValue: number
    previousValue: number
    unit: string
    trend: string
    sparkline: number[]
  }>
  recentSessions: Array<{
    id: string
    modeSlug: string
    modeName?: string
    completedAt: string
  }>
  recommendations: Array<{ slug: string; name: string }>
}

function HealthDetail() {
  const { t } = useTranslation()
  const { category } = Route.useParams()
  const token = useAuthStore((s) => s.token)

  const { data, isLoading } = useQuery({
    queryKey: ['health', category],
    queryFn: async () => {
      const res = await fetch(`/api/health/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<HealthDetailData>
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-12 text-center">
        <p className="text-[var(--text-secondary)]">{t('health.categoryNotFound')}</p>
      </div>
    )
  }

  const accentColor = CATEGORY_COLORS[data.category] ?? 'var(--color-core)'
  const trendColor =
    data.trend === 'improving'
      ? 'var(--color-health-green)'
      : data.trend === 'declining'
        ? 'var(--color-health-red)'
        : 'var(--text-tertiary)'

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to="/"
        className="wave-entrance-1 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <Icon name="arrow-left" size="sm" /> {t('health.backToDashboard')}
      </Link>

      {/* Header */}
      <div className="wave-entrance-1 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {data.category.replace(/-/g, ' ')} {t('health.suffix')}
          </span>
          <span style={{ color: trendColor }}>
            <Icon name={TREND_ICONS[data.trend] ?? 'equals'} size="md" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-body text-5xl font-bold" style={{ color: accentColor }}>
            {data.score}
          </span>
          <span className="text-lg text-[var(--text-tertiary)]">{t('health.outOf100')}</span>
        </div>
        <div className="shadow-neo-inset mt-4 h-3 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${data.score}%`,
              backgroundColor: accentColor,
              transitionTimingFunction: 'var(--wave-ease)',
            }}
          />
        </div>
      </div>

      {/* Metrics with sparklines */}
      {data.metrics.length > 0 && (
        <div className="wave-entrance-2">
          <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('health.metrics')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.metrics.map((m) => (
              <div key={m.name} className="shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{m.name.replace(/_/g, ' ')}</span>
                  <span style={{ color: trendColor }}>
                    <Icon name={TREND_ICONS[m.trend] ?? 'equals'} size="sm" />
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-bold">
                    {m.currentValue} <span className="text-sm font-normal text-[var(--text-tertiary)]">{m.unit}</span>
                  </span>
                  {m.sparkline.length >= 2 && (
                    <SparklineChart data={m.sparkline} color={accentColor} width={120} height={32} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {data.recentSessions.length > 0 && (
        <div className="wave-entrance-3 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('health.recentSessions')}
          </h2>
          <div className="mt-3 space-y-2">
            {data.recentSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <Link
                  to="/modes/$slug"
                  params={{ slug: s.modeSlug }}
                  className="text-[var(--text-secondary)] underline decoration-[var(--text-tertiary)] underline-offset-2 hover:text-[var(--text-primary)]"
                >
                  {s.modeName ?? s.modeSlug}
                </Link>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {new Date(s.completedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended modes */}
      {data.recommendations.length > 0 && (
        <div className="wave-entrance-4 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('health.recommendedModes')}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.recommendations.map((rec) => (
              <Link
                key={rec.slug}
                to="/modes/$slug"
                params={{ slug: rec.slug }}
                className="neo-btn shadow-neo-button rounded-full px-4 py-2 text-xs font-semibold"
                style={{ color: accentColor }}
              >
                {rec.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
