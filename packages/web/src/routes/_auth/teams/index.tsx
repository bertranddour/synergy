import { TEAM_TYPES } from '@synergy/shared'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/teams/')({
  component: TeamsPage,
})

function TeamsPage() {
  const token = useAuthStore((s) => s.token)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('mission')

  const createTeam = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      })
      if (!res.ok) throw new Error('Failed to create team')
      return res.json() as Promise<{ team: { id: string; name: string } }>
    },
    onSuccess: () => {
      setShowCreate(false)
      setName('')
    },
  })

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Teams</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Collective health, shared progress, team-level coaching.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="neo-btn shadow-neo-button rounded-full px-6 py-3 text-sm font-semibold"
        >
          Create Team
        </button>
      </div>

      {/* Create team form */}
      {showCreate && (
        <div className="wave-entrance-2 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">New Team</h2>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team name"
              className="input-embossed w-full max-w-sm px-5 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <div className="flex gap-2">
              {TEAM_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`neo-btn rounded-full px-4 py-2 text-xs capitalize ${
                    type === t ? 'shadow-neo-embossed font-semibold' : 'shadow-neo-button text-[var(--text-tertiary)]'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => createTeam.mutate()}
                disabled={!name || createTeam.isPending}
                className="neo-btn shadow-neo-button rounded-full px-8 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-sm text-[var(--text-tertiary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for team list */}
      <div className="wave-entrance-3 shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
        <p className="text-[var(--text-secondary)]">Create a team to start tracking collective health and progress.</p>
      </div>
    </div>
  )
}
