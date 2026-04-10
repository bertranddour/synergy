import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Icon } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/teams/$id')({
  component: TeamDashboard,
})

function TeamDashboard() {
  const { id } = Route.useParams()
  const token = useAuthStore((s) => s.token)

  const teamQuery = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        team: { id: string; name: string; type: string }
        members: Array<{ userId: string; name: string; email: string; role: string }>
      }>
    },
  })

  const healthQuery = useQuery({
    queryKey: ['team-health', id],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${id}/health`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        teamHealth: Array<{ name: string; score: number; trend: string }>
        memberProgress: Array<{ userId: string; name: string; completion: number; consistency: number; growth: number }>
      }>
    },
  })

  if (teamQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  const team = teamQuery.data?.team
  const members = teamQuery.data?.members ?? []

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <Link to="/teams" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <span className="inline-flex items-center gap-1">
            <Icon name="arrow-left" size="sm" /> Teams
          </span>
        </Link>
        <h1 className="font-display mt-2 text-3xl tracking-tight">{team?.name}</h1>
        <p className="text-sm capitalize text-[var(--text-secondary)]">{team?.type.replace('-', ' ')}</p>
      </div>

      {/* Team health */}
      {healthQuery.data && healthQuery.data.teamHealth.length > 0 && (
        <div className="wave-entrance-2 grid gap-4 md:grid-cols-3">
          {healthQuery.data.teamHealth.map((cat) => (
            <div key={cat.name} className="shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {cat.name.replace('-', ' ')}
              </span>
              <p className="mt-2 text-3xl font-bold">{cat.score}</p>
            </div>
          ))}
        </div>
      )}

      {/* Members */}
      <div className="wave-entrance-3 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Members ({members.length})</h2>
        <div className="mt-4 space-y-3">
          {members.map((m) => (
            <div key={m.userId} className="flex items-center justify-between shadow-neo-embossed rounded-xl p-4">
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.email}</p>
              </div>
              <span className="text-xs capitalize text-[var(--text-tertiary)]">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
