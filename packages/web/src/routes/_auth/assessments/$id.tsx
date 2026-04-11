import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ScenarioBreakdown } from '../../../components/assessments/ScenarioBreakdown'
import { Icon } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/assessments/$id')({
  component: ActiveAssessment,
})

interface Scenario {
  id: string
  description: string
  options: { a: string; b: string; c: string; d: string }
}

function ActiveAssessment() {
  const { id } = Route.useParams()
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    maxScore: number
    level: string
    aliciaDebrief: string
    recommendations: Array<{ modeSlug: string; reason: string }>
  } | null>(null)

  // Load assessment detail with scenarios
  const assessmentQuery = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      const res = await fetch(`/api/assessments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load assessment')
      return res.json() as Promise<{
        assessment: {
          id: string
          frameworkId: string
          status: string
          responses: Array<{ scenarioId: string; answer: string; score: number }>
        }
        scenarios: Scenario[]
      }>
    },
  })

  const submitAnswer = useMutation({
    mutationFn: async (params: { scenarioId: string; answer: string }) => {
      await fetch(`/api/assessments/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
    },
  })

  const completeAssessment = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/assessments/${id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      return res.json() as Promise<{
        score: number
        maxScore: number
        level: string
        aliciaDebrief: string
        recommendations: Array<{ modeSlug: string; reason: string }>
      }>
    },
    onSuccess: (data) => {
      setResult(data)
      setCompleted(true)
    },
  })

  const scenarios = assessmentQuery.data?.scenarios ?? []

  const handleSelect = (scenarioId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [scenarioId]: answer }))
    submitAnswer.mutate({ scenarioId, answer })

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 300)
    } else {
      completeAssessment.mutate()
    }
  }

  if (assessmentQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  if (assessmentQuery.isError) {
    return (
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
        <p className="text-[var(--color-error)]">Failed to load assessment</p>
        <button
          type="button"
          onClick={() => void navigate({ to: '/assessments' })}
          className="neo-btn shadow-neo-button mt-4 rounded-full px-8 py-3"
        >
          Back
        </button>
      </div>
    )
  }

  if (completed && result) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="wave-entrance-1 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
          <h1 className="font-display text-3xl">Assessment Complete</h1>
          <p className="mt-4 text-5xl font-bold">
            {result.score}/{result.maxScore}
          </p>
          <p className="mt-2 text-lg capitalize text-[var(--text-secondary)]">{result.level.replace('-', ' ')}</p>
        </div>

        {result.aliciaDebrief && (
          <div className="wave-entrance-2 shadow-neo-well rounded-[1.8rem] border-l-4 border-[var(--color-synergy)] bg-[var(--surface)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-synergy)]">Alicia&apos;s Debrief</p>
            <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{result.aliciaDebrief}</p>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="wave-entrance-3 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Recommended Modes</p>
            <div className="mt-3 space-y-2">
              {result.recommendations.map((rec) => (
                <p key={rec.modeSlug} className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <Icon name="arrow-right" size="sm" />{' '}
                  {rec.modeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: {rec.reason}
                </p>
              ))}
            </div>
          </div>
        )}

        {assessmentQuery.data?.assessment.responses && assessmentQuery.data.assessment.responses.length > 0 && (
          <div className="wave-entrance-4 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <ScenarioBreakdown responses={assessmentQuery.data.assessment.responses} />
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => void navigate({ to: '/assessments' })}
            className="neo-btn shadow-neo-button rounded-full px-8 py-3 font-semibold"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    )
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">No scenarios available for this assessment.</p>
          <button
            type="button"
            onClick={() => void navigate({ to: '/assessments' })}
            className="neo-btn shadow-neo-button mt-4 rounded-full px-8 py-3"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentIndex]
  if (!scenario) return null

  const optionKeys = ['a', 'b', 'c', 'd'] as const

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>
            Scenario {currentIndex + 1} of {scenarios.length}
          </span>
          <span>{Math.round(((currentIndex + 1) / scenarios.length) * 100)}%</span>
        </div>
        <div className="shadow-neo-inset mt-2 h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-[var(--color-max)] transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <p className="text-lg leading-relaxed">{scenario.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        {optionKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(scenario.id, key)}
            className={`neo-btn w-full rounded-[1.2rem] p-5 text-left transition-all ${
              answers[scenario.id] === key ? 'shadow-neo-embossed' : 'shadow-neo-well'
            }`}
          >
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase shadow-neo-button">
                {key}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{scenario.options[key]}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
