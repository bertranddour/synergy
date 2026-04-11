import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/programs/active')({
  component: ActiveProgram,
})

function ActiveProgram() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)

  const activeQuery = useQuery({
    queryKey: ['program-active'],
    queryFn: async () => {
      const res = await fetch('/api/programs/active', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        program: { slug: string; name: string; description: string; durationDays: number }
        userProgram: { id: string; currentDay: number; startDate: string }
        schedule: Array<{ day: number; date: string; modeSlug: string; description: string; completed: boolean }>
        metricsBaseline: Record<string, number>
      }>
    },
  })

  if (activeQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  if (!activeQuery.data) {
    return (
      <div className="space-y-8">
        <div className="wave-entrance-1">
          <h1 className="font-display text-3xl tracking-tight">{t('programs.activeProgram')}</h1>
        </div>
        <div className="shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">{t('programs.noActive')}</p>
          <Link
            to="/programs"
            className="neo-btn shadow-neo-button mt-4 inline-block rounded-full px-8 py-3 font-semibold"
          >
            {t('programs.programCatalog')}
          </Link>
        </div>
      </div>
    )
  }

  const { program, userProgram, schedule } = activeQuery.data
  const completedCount = schedule.filter((d) => d.completed).length

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <Link to="/programs" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <span className="inline-flex items-center gap-1">
            <Icon name="arrow-left" size="sm" /> {t('nav.programs')}
          </span>
        </Link>
        <h1 className="font-display mt-2 text-3xl tracking-tight">{t(`programContent.${program.slug}.name`)}</h1>
        <p className="mt-1 text-[var(--text-secondary)]">{t(`programContent.${program.slug}.description`)}</p>
      </div>

      {/* Progress */}
      <div className="wave-entrance-2 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('progress.title')}</span>
          <span className="text-sm text-[var(--text-secondary)]">
            {t('programs.dayOf', { current: userProgram.currentDay, total: program.durationDays })}
          </span>
        </div>
        <div className="shadow-neo-inset mt-3 h-3 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-[var(--color-synergy)] transition-all duration-700"
            style={{
              width: `${(completedCount / schedule.length) * 100}%`,
              transitionTimingFunction: 'var(--wave-ease)',
            }}
          />
        </div>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          {t('programs.modesCompleted', { completed: completedCount, total: schedule.length })}
        </p>
      </div>

      {/* Schedule */}
      <div className="wave-entrance-3 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('programs.schedule')}</h2>
        <div className="mt-4 space-y-3">
          {schedule.map((day) => (
            <div key={day.day} className="flex items-center gap-4 text-sm">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  day.completed
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'shadow-neo-button'
                }`}
              >
                {day.completed ? <Icon name="check" size="xs" /> : day.day}
              </span>
              <div className="flex-1">
                <p className={day.completed ? 'text-[var(--text-tertiary)] line-through' : 'font-semibold'}>
                  {t(`modeContent.${day.modeSlug}.name`)}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {t(`programContent.${program.slug}.schedule.${day.day - 1}`)}
                </p>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
