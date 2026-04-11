import { FRAMEWORK_COLORS, FRAMEWORK_DESCRIPTIONS, FRAMEWORK_NAMES, type FrameworkSlug } from '@synergy/shared'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SparklineChart } from '../../../components/dashboard/SparklineChart'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/assessments/')({
  component: AssessmentCenter,
})

function AssessmentCenter() {
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()

  const assessmentsQuery = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const res = await fetch('/api/assessments?limit=20', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        assessments: Array<{
          id: string
          frameworkId: string
          status: string
          totalScore: number | null
          level: string | null
          startedAt: string
          completedAt: string | null
        }>
      }>
    },
  })

  const startAssessment = useMutation({
    mutationFn: async (frameworkSlug: string) => {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ frameworkSlug }),
      })
      if (!res.ok) throw new Error('Failed to start')
      return res.json() as Promise<{ assessment: { id: string } }>
    },
    onSuccess: (data) => {
      void navigate({ to: '/assessments/$id', params: { id: data.assessment.id } })
    },
  })

  const frameworks = Object.keys(FRAMEWORK_COLORS) as FrameworkSlug[]

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight">Assessment Center</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Scenario-based diagnostics. No self-ratings — real situations with real choices.
        </p>
      </div>

      <div className="wave-entrance-2 grid gap-6 md:grid-cols-2">
        {frameworks.map((slug) => {
          const fwAssessments =
            assessmentsQuery.data?.assessments.filter(
              (a) => a.frameworkId === `fw-${slug}` && a.status === 'completed',
            ) ?? []
          const lastAssessment = fwAssessments[0]

          return (
            <div key={slug} className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: FRAMEWORK_COLORS[slug] }} />
                <span className="font-display text-xl">{FRAMEWORK_NAMES[slug]}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {FRAMEWORK_DESCRIPTIONS[slug]}
              </p>

              {lastAssessment?.level && (
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Last result:</span>
                    <span className="ml-2 text-sm font-semibold capitalize">
                      {lastAssessment.level.replace('-', ' ')}
                    </span>
                    {lastAssessment.totalScore !== null && (
                      <span className="ml-1 text-sm text-[var(--text-tertiary)]">({lastAssessment.totalScore}/35)</span>
                    )}
                  </div>
                  {fwAssessments.length >= 2 && (
                    <SparklineChart
                      data={fwAssessments.map((a) => a.totalScore ?? 0).reverse()}
                      color={FRAMEWORK_COLORS[slug]}
                      width={80}
                      height={24}
                    />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => startAssessment.mutate(slug)}
                disabled={startAssessment.isPending}
                className="neo-btn shadow-neo-button mt-4 w-full rounded-full px-6 py-2.5 text-sm font-semibold"
                style={{ color: FRAMEWORK_COLORS[slug] }}
              >
                {startAssessment.isPending ? 'Starting...' : 'Start Assessment'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Assessment History */}
      {assessmentsQuery.data &&
        assessmentsQuery.data.assessments.filter((a) => a.status === 'completed').length > 0 && (
          <div className="wave-entrance-3 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Assessment History</h2>
            <div className="mt-4 space-y-2">
              {assessmentsQuery.data.assessments
                .filter((a) => a.status === 'completed')
                .map((a) => {
                  const fwSlug = a.frameworkId.replace('fw-', '') as FrameworkSlug
                  return (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: FRAMEWORK_COLORS[fwSlug] ?? 'var(--text-tertiary)' }}
                        />
                        <span>{FRAMEWORK_NAMES[fwSlug] ?? fwSlug}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {a.totalScore}/{35}
                        </span>
                        <span className="capitalize text-[var(--text-tertiary)]">{a.level?.replace('-', ' ')}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
    </div>
  )
}
