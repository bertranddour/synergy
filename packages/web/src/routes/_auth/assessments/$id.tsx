import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
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
  const [scenarios] = useState<Scenario[]>([]) // Loaded on start
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<{ score: number; maxScore: number; level: string } | null>(null)

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
      return res.json() as Promise<{ score: number; maxScore: number; level: string }>
    },
    onSuccess: (data) => {
      setResult(data)
      setCompleted(true)
    },
  })

  const handleSelect = (scenarioId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [scenarioId]: answer }))
    submitAnswer.mutate({ scenarioId, answer })

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 300)
    } else {
      completeAssessment.mutate()
    }
  }

  if (completed && result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="wave-entrance-1 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10">
          <h1 className="font-display text-3xl">Assessment Complete</h1>
          <p className="mt-4 text-5xl font-bold">{result.score}/{result.maxScore}</p>
          <p className="mt-2 text-lg capitalize text-[var(--text-secondary)]">
            {result.level.replace('-', ' ')}
          </p>
          <button
            type="button"
            onClick={() => void navigate({ to: '/assessments' })}
            className="neo-btn shadow-neo-button mt-6 rounded-full px-8 py-3 font-semibold"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentIndex]
  if (!scenario) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="wave-spinner mx-auto" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading scenarios...</p>
        </div>
      </div>
    )
  }

  const optionKeys = ['a', 'b', 'c', 'd'] as const

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
          <span>{Math.round(((currentIndex + 1) / scenarios.length) * 100)}%</span>
        </div>
        <div className="shadow-neo-inset mt-2 h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-[var(--color-max)] transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario */}
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <p className="text-lg leading-relaxed">{scenario.description}</p>
      </div>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {optionKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(scenario.id, key)}
            className={`neo-btn w-full rounded-[1.2rem] p-5 text-left transition-all ${
              answers[scenario.id] === key
                ? 'shadow-neo-embossed'
                : 'shadow-neo-well'
            }`}
          >
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase shadow-neo-button">
                {key}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {scenario.options[key]}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
