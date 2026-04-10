import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/programs/')({
  component: ProgramCatalog,
})

interface Program {
  slug: string
  name: string
  description: string
  durationDays: number
  frameworksRequired: string[]
  targetStage: string | null
}

function ProgramCatalog() {
  const token = useAuthStore((s) => s.token)

  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await fetch('/api/programs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{ programs: Program[] }>
    },
  })

  const activeQuery = useQuery({
    queryKey: ['program-active'],
    queryFn: async () => {
      const res = await fetch('/api/programs/active', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        program: { slug: string; name: string }
        userProgram: { id: string; currentDay: number }
        schedule: Array<{ day: number; date: string; modeSlug: string; completed: boolean }>
      }>
    },
  })

  const enrollMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/programs/${slug}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to enroll')
      return res.json()
    },
  })

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight">Training Programs</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Guided multi-mode sequences. Not "do whatever." Structured capability building.
        </p>
      </div>

      {/* Active program */}
      {activeQuery.data && (
        <div className="wave-entrance-2 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-synergy)]">Active Program</span>
              <h2 className="font-display mt-1 text-xl">{activeQuery.data.program.name}</h2>
            </div>
            <span className="text-sm text-[var(--text-tertiary)]">Day {activeQuery.data.userProgram.currentDay}</span>
          </div>
          <div className="mt-4 space-y-2">
            {activeQuery.data.schedule.map((day) => (
              <div key={day.day} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    day.completed
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'shadow-neo-button'
                  }`}
                >
                  {day.completed ? '✓' : day.day}
                </span>
                <span className={day.completed ? 'text-[var(--text-tertiary)] line-through' : ''}>
                  {day.modeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span className="ml-auto text-xs text-[var(--text-tertiary)]">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Program catalog */}
      <div className="wave-entrance-3 grid gap-6 md:grid-cols-2">
        {programsQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="wave-skeleton h-48 rounded-[1.8rem]" />)
        ) : programsQuery.data?.programs.length === 0 ? (
          <div className="col-span-2 shadow-neo-inset rounded-[2rem] p-12 text-center">
            <p className="text-[var(--text-secondary)]">No training programs available yet.</p>
          </div>
        ) : (
          programsQuery.data?.programs.map((program) => (
            <div key={program.slug} className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
              <h3 className="font-display text-lg">{program.name}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{program.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                <span>{program.durationDays} days</span>
                <span>·</span>
                <span>{program.frameworksRequired.join(', ')}</span>
              </div>
              <button
                type="button"
                onClick={() => enrollMutation.mutate(program.slug)}
                disabled={!!activeQuery.data || enrollMutation.isPending}
                className="neo-btn shadow-neo-button mt-4 w-full rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                {activeQuery.data ? 'Finish current program first' : 'Enroll'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
