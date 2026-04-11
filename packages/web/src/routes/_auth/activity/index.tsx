import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/activity/')({
  component: ActivityPage,
})

interface ActivityEvent {
  type: 'session' | 'assessment' | 'observation'
  id: string
  title: string
  description: string
  timestamp: string
}

const TYPE_ICONS: Record<string, IconName> = {
  session: 'lightning',
  assessment: 'clipboard-text',
  observation: 'brain',
}

function groupByDate(events: ActivityEvent[]): Array<{ label: string; events: ActivityEvent[] }> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const todayGroup: ActivityEvent[] = []
  const yesterdayGroup: ActivityEvent[] = []
  const weekGroup: ActivityEvent[] = []
  const earlierGroup: ActivityEvent[] = []

  for (const event of events) {
    const date = new Date(event.timestamp)
    if (date >= today) todayGroup.push(event)
    else if (date >= yesterday) yesterdayGroup.push(event)
    else if (date >= weekAgo) weekGroup.push(event)
    else earlierGroup.push(event)
  }

  const groups = [
    { label: 'activity.today', events: todayGroup },
    { label: 'activity.yesterday', events: yesterdayGroup },
    { label: 'activity.thisWeek', events: weekGroup },
    { label: 'activity.earlier', events: earlierGroup },
  ]

  return groups.filter((g) => g.events.length > 0)
}

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function ActivityPage() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)

  const { data, isLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      const res = await fetch('/api/activity?limit=30', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{ events: ActivityEvent[] }>
    },
  })

  const groups = data ? groupByDate(data.events) : []

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight">{t('activity.title')}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{t('activity.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="wave-skeleton h-16 rounded-[1.5rem]" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="wave-entrance-2 shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">{t('activity.empty')}</p>
          <Link
            to="/modes"
            className="neo-btn shadow-neo-button mt-4 inline-block rounded-full px-8 py-3 font-semibold"
          >
            {t('dashboard.browseModes')}
          </Link>
        </div>
      ) : (
        <div className="wave-entrance-2 space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t(group.label)}</h2>
              <div className="space-y-2">
                {group.events.map((event) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className="shadow-neo-well flex items-center gap-4 rounded-[1.5rem] bg-[var(--surface)] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-neo-button">
                      <Icon name={TYPE_ICONS[event.type] ?? 'lightning'} size="md" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{event.title}</p>
                      <p className="truncate text-xs capitalize text-[var(--text-secondary)]">{event.description}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
                      {relativeTime(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
