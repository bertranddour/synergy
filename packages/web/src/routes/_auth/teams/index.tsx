import { TEAM_TYPES } from '@synergy/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/teams/')({
  component: TeamsPage,
})

function TeamsPage() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('mission')

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch teams')
      return res.json() as Promise<{
        teams: Array<{
          id: string
          name: string
          type: string
          role: string
          createdAt: string
        }>
      }>
    },
  })

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
      void queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{t('teams.title')}</h1>
          <p className="mt-2 text-[var(--text-secondary)]">{t('teams.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="neo-btn shadow-neo-button rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t('teams.createTeam')}
        </button>
      </div>

      {showCreate && (
        <div className="wave-entrance-2 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('teams.newTeam')}</h2>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('teams.teamNamePlaceholder')}
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
                {t('common.create')}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-sm text-[var(--text-tertiary)]"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {teamsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="wave-skeleton h-20 rounded-[1.5rem]" />
          ))}
        </div>
      ) : teamsQuery.isError ? (
        <div className="shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-8 text-center">
          <p className="text-[var(--color-error)]">{t('teams.failedToLoad')}</p>
          <button
            type="button"
            onClick={() => void teamsQuery.refetch()}
            className="neo-btn shadow-neo-button mt-4 rounded-full px-6 py-2 text-sm"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : teamsQuery.data?.teams.length === 0 ? (
        <div className="wave-entrance-3 shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">{t('teams.emptyState')}</p>
        </div>
      ) : (
        <div className="wave-entrance-3 space-y-4">
          {teamsQuery.data?.teams.map((team) => (
            <Link
              key={team.id}
              to="/teams/$id"
              params={{ id: team.id }}
              className="shadow-neo-well wave-card-hover block rounded-[1.5rem] bg-[var(--surface)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-xs capitalize text-[var(--text-tertiary)]">{team.type.replace('-', ' ')}</p>
                </div>
                <span className="text-xs capitalize text-[var(--text-tertiary)]">{team.role}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
