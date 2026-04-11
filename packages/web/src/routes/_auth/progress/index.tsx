import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ProgressRings } from '../../../components/dashboard/ProgressRings'
import { SparklineChart } from '../../../components/dashboard/SparklineChart'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/progress/')({
  component: ProgressPage,
})

function ProgressPage() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)

  const progressQuery = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        completion: { value: number; target: number; percentage: number }
        consistency: { streakWeeks: number }
        growth: { score: number; trend: string; improvingMetrics: string[] }
        period: { start: string; end: string; type: string }
      }>
    },
  })

  const historyQuery = useQuery({
    queryKey: ['progress-history'],
    queryFn: async () => {
      const res = await fetch('/api/progress/history?period=weekly&limit=12', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        history: Array<{
          periodStart: string
          periodEnd: string
          completion: number
          consistency: number
          growth: number
          modesCompleted: number
        }>
      }>
    },
  })

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight">{t('progress.title')}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{t('progress.subtitle')}</p>
      </div>

      {/* Current rings */}
      <div className="wave-entrance-2">
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

      {/* Ring details */}
      {progressQuery.data && (
        <div className="wave-entrance-3 grid gap-6 md:grid-cols-3">
          <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              {t('progress.completion')}
            </span>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-core)' }}>
              {progressQuery.data.completion.value}/{progressQuery.data.completion.target}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('progress.modesThisPeriod')}</p>
          </div>
          <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              {t('progress.streak')}
            </span>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-health-green)' }}>
              {progressQuery.data.consistency.streakWeeks}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('progress.consecutiveWeeks')}</p>
          </div>
          <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              {t('progress.growth')}
            </span>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-synergy)' }}>
              {progressQuery.data.growth.score}%
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('progress.metricsImproving')}</p>
          </div>
        </div>
      )}

      {/* History Sparklines */}
      {historyQuery.data && historyQuery.data.history.length >= 2 && (
        <div className="wave-entrance-4 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('progress.trendsOverTime')}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {t('progress.completion')}
              </span>
              <div className="mt-3">
                <SparklineChart
                  data={historyQuery.data.history.map((h) => h.completion)}
                  color="var(--color-core)"
                  width={180}
                  height={40}
                />
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {t('progress.percentThisWeek', {
                  value: historyQuery.data.history[historyQuery.data.history.length - 1]?.completion ?? 0,
                })}
              </p>
            </div>
            <div className="shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {t('progress.consistency')}
              </span>
              <div className="mt-3">
                <SparklineChart
                  data={historyQuery.data.history.map((h) => h.consistency)}
                  color="var(--color-health-green)"
                  width={180}
                  height={40}
                />
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {t('progress.weekStreak', {
                  value: historyQuery.data.history[historyQuery.data.history.length - 1]?.consistency ?? 0,
                })}
              </p>
            </div>
            <div className="shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {t('progress.growth')}
              </span>
              <div className="mt-3">
                <SparklineChart
                  data={historyQuery.data.history.map((h) => h.growth)}
                  color="var(--color-synergy)"
                  width={180}
                  height={40}
                />
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {t('progress.percentImproving', {
                  value: historyQuery.data.history[historyQuery.data.history.length - 1]?.growth ?? 0,
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modes per week */}
      {historyQuery.data && historyQuery.data.history.length > 0 && (
        <div className="wave-entrance-5 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('progress.weeklyActivity')}
          </h2>
          <div className="mt-4 space-y-2">
            {historyQuery.data.history.map((entry) => (
              <div key={entry.periodStart} className="flex items-center gap-4 text-sm">
                <span className="w-24 text-[var(--text-tertiary)]">
                  {new Date(entry.periodStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1">
                  <div className="shadow-neo-inset h-2 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${entry.completion}%`, backgroundColor: 'var(--color-core)' }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-[var(--text-tertiary)]">
                  {t('progress.modesCount', { count: entry.modesCompleted })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
