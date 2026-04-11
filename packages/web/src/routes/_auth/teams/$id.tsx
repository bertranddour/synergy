import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '../../../components/ui/Icon'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/teams/$id')({
  component: TeamDashboard,
})

function TeamDashboard() {
  const { t } = useTranslation()
  const { id } = Route.useParams()
  const { user, token } = useAuthStore()
  const queryClient = useQueryClient()

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'lead'>('member')
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)

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

  const team = teamQuery.data?.team
  const members = teamQuery.data?.members ?? []
  const isLead = members.some((m) => m.userId === user?.id && m.role === 'lead')

  const invitationsQuery = useQuery({
    queryKey: ['team-invitations', id],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${id}/invitations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return { invitations: [] }
      return res.json() as Promise<{
        invitations: Array<{
          id: string
          email: string
          role: string
          invitedByName: string
          createdAt: string
          expiresAt: string
        }>
      }>
    },
    enabled: isLead,
  })

  const sendInvite = useMutation({
    mutationFn: async (params: { email: string; role: string }) => {
      const res = await fetch(`/api/teams/${id}/invitations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        throw new Error(data.error)
      }
      return res.json()
    },
    onSuccess: () => {
      setInviteEmail('')
      setInviteSuccess(t('teams.inviteSent'))
      setInviteError(null)
      queryClient.invalidateQueries({ queryKey: ['team-invitations', id] })
      setTimeout(() => setInviteSuccess(null), 3000)
    },
    onError: (err) => {
      setInviteError(err.message)
      setInviteSuccess(null)
    },
  })

  const revokeInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      await fetch(`/api/teams/${id}/invitations/${inviteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations', id] })
    },
  })

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      await fetch(`/api/teams/${id}/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', id] })
    },
  })

  if (teamQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <Link to="/teams" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <span className="inline-flex items-center gap-1">
            <Icon name="arrow-left" size="sm" /> {t('teams.title')}
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
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          {t('teams.membersCount', { count: members.length })}
        </h2>
        <div className="mt-4 space-y-3">
          {members.map((m) => (
            <div key={m.userId} className="flex items-center justify-between shadow-neo-embossed rounded-xl p-4">
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs capitalize text-[var(--text-tertiary)]">{m.role}</span>
                {isLead && m.userId !== user?.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(t('teams.removeConfirm', { name: m.name }))) removeMember.mutate(m.userId)
                    }}
                    className="text-xs text-[var(--color-error)] hover:underline"
                  >
                    {t('teams.removeMember')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite form */}
      {isLead && (
        <section className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('teams.inviteMembers')}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendInvite.mutate({ email: inviteEmail, role: inviteRole })
            }}
            className="mt-4 flex gap-3"
          >
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t('teams.inviteEmailPlaceholder')}
              className="input-embossed flex-1 px-5 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'member' | 'lead')}
              className="input-embossed rounded-xl px-4 py-2.5 text-sm"
            >
              <option value="member">{t('common.member') ?? 'Member'}</option>
              <option value="lead">{t('common.lead') ?? 'Lead'}</option>
            </select>
            <button
              type="submit"
              disabled={sendInvite.isPending || !inviteEmail}
              className="neo-btn shadow-neo-button rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              {sendInvite.isPending ? t('teams.sending') : t('teams.sendInvite')}
            </button>
          </form>
          {inviteSuccess && <p className="mt-2 text-sm text-[var(--color-success)]">{inviteSuccess}</p>}
          {inviteError && <p className="mt-2 text-sm text-[var(--color-error)]">{inviteError}</p>}
        </section>
      )}

      {/* Pending invitations */}
      {isLead && invitationsQuery.data && invitationsQuery.data.invitations.length > 0 && (
        <section className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            {t('teams.pendingInvitations')}
          </h2>
          <div className="mt-4 space-y-2">
            {invitationsQuery.data.invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold">{inv.email}</span>
                  <span className="ml-2 text-xs text-[var(--text-tertiary)]">{inv.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {t('teams.invitedBy', { name: inv.invitedByName })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(t('teams.revokeConfirm', { email: inv.email }))) revokeInvite.mutate(inv.id)
                    }}
                    className="text-xs text-[var(--color-error)] hover:underline"
                  >
                    {t('teams.revokeInvite')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
