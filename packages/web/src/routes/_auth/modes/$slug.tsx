import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/modes/$slug')({
  component: ModeDetail,
})

interface ModeDetailData {
  mode: {
    id: string
    slug: string
    name: string
    purpose: string
    trigger: string
    flowName: string
    fieldsSchema: Array<{
      name: string
      description: string
      type: string
      required: boolean
      example?: string
      options?: string[]
    }>
    aiCoachPrompts: Array<{ fieldIndex: number; prompt: string }>
    doneSignal: string
    metricsSchema: Array<{ name: string; unit: string }>
    composabilityHooks: Array<{
      direction: string
      modeSlug: string
      description: string
    }>
    timeEstimateMinutes: number
    framework: { slug: string; name: string; color: string } | null
  }
  recentSessions: Array<{
    id: string
    status: string
    startedAt: string
    completedAt: string | null
  }>
}

function ModeDetail() {
  const { slug } = Route.useParams()
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()

  const startSession = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ modeSlug: slug }),
      })
      if (!res.ok) throw new Error('Failed to start session')
      return res.json() as Promise<{ session: { id: string } }>
    },
    onSuccess: (data) => {
      void navigate({ to: '/runner/$sessionId', params: { sessionId: data.session.id } })
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['mode', slug],
    queryFn: async () => {
      const res = await fetch(`/api/modes/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch mode')
      return res.json() as Promise<ModeDetailData>
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
        <p className="text-[var(--text-secondary)]">Mode not found</p>
      </div>
    )
  }

  const { mode, recentSessions } = data

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link to="/modes" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        ← Back to Mode Library
      </Link>

      {/* Header */}
      <div className="wave-entrance-1">
        {mode.framework && (
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: mode.framework.color }}
            />
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              {mode.framework.name}
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">·</span>
            <span className="text-xs text-[var(--text-tertiary)]">{mode.flowName}</span>
          </div>
        )}
        <h1 className="font-display mt-2 text-3xl tracking-tight md:text-4xl">
          {mode.name}
        </h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">
          {mode.purpose}
        </p>
      </div>

      {/* Trigger */}
      <div className="wave-entrance-2 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          When to use
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
          {mode.trigger}
        </p>
      </div>

      {/* Fields */}
      <div className="wave-entrance-3 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          Fields ({mode.fieldsSchema.length})
        </h2>
        <div className="mt-4 space-y-4">
          {mode.fieldsSchema.map((field, i) => (
            <div key={i} className="shadow-neo-embossed rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold shadow-neo-button">
                  {i + 1}
                </span>
                <span className="font-semibold">{field.name}</span>
                <span className="text-xs text-[var(--text-tertiary)]">({field.type})</span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{field.description}</p>
              {field.example && (
                <p className="mt-1 text-xs italic text-[var(--text-tertiary)]">
                  Example: {field.example}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Done Signal */}
      <div className="wave-entrance-4 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          Done Signal
        </h2>
        <p className="mt-3 font-semibold italic text-[var(--text-secondary)]">
          "{mode.doneSignal}"
        </p>
      </div>

      {/* Meta: time, metrics, composability */}
      <div className="wave-entrance-5 grid gap-6 md:grid-cols-2">
        <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Time Estimate
          </h2>
          <p className="mt-3 text-2xl font-bold">{mode.timeEstimateMinutes} min</p>
        </div>

        {mode.composabilityHooks.length > 0 && (
          <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              Connected Modes
            </h2>
            <div className="mt-3 space-y-2">
              {mode.composabilityHooks.map((hook, i) => (
                <div key={i} className="text-sm">
                  <span className="text-[var(--text-tertiary)]">
                    {hook.direction === 'feeds_into' ? '→' : '←'}
                  </span>{' '}
                  <Link
                    to="/modes/$slug"
                    params={{ slug: hook.modeSlug }}
                    className="underline decoration-[var(--text-tertiary)] underline-offset-2 hover:text-[var(--text-primary)]"
                  >
                    {hook.modeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Recent Sessions
          </h2>
          <div className="mt-3 space-y-2">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">
                  {new Date(session.startedAt).toLocaleDateString()}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs ${
                  session.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : session.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {session.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Mode Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => startSession.mutate()}
          disabled={startSession.isPending}
          className="neo-btn shadow-neo-button rounded-full px-12 py-4 text-lg font-semibold disabled:opacity-50"
          style={mode.framework ? { color: mode.framework.color } : undefined}
        >
          {startSession.isPending ? 'Starting...' : `Start ${mode.name}`}
        </button>
      </div>
    </div>
  )
}
