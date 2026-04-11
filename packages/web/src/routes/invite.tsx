import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '../components/ui/Icon'
import { useAuthStore } from '../stores/auth'

interface InviteInfo {
  teamName: string
  inviterName: string
  email: string
  expired: boolean
}

export const Route = createFileRoute('/invite')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: InvitePage,
})

function InvitePage() {
  const { t } = useTranslation()
  const { token: inviteToken } = Route.useSearch()
  const navigate = useNavigate()
  const authToken = useAuthStore((s) => s.token)

  const [info, setInfo] = useState<InviteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [sendingMagicLink, setSendingMagicLink] = useState(false)
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null)

  useEffect(() => {
    if (!inviteToken) {
      setError(t('invite.invalidToken'))
      setLoading(false)
      return
    }

    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/invitations/info?token=${encodeURIComponent(inviteToken)}`)
        if (!res.ok) {
          throw new Error(t('invite.invalidToken'))
        }
        const data = (await res.json()) as InviteInfo
        setInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('invite.invalidToken'))
      } finally {
        setLoading(false)
      }
    }

    void fetchInfo()
  }, [inviteToken, t])

  const handleAccept = useCallback(async () => {
    setAccepting(true)
    setAcceptError(null)

    try {
      const token = useAuthStore.getState().token
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: inviteToken }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        throw new Error(data.error)
      }

      const data = (await res.json()) as { teamId: string }
      setAccepted(true)

      setTimeout(() => {
        void navigate({ to: '/teams/$id', params: { id: data.teamId } })
      }, 1000)
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : t('errors.genericError'))
    } finally {
      setAccepting(false)
    }
  }, [inviteToken, navigate, t])

  const handleSendMagicLink = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!info) return

      setSendingMagicLink(true)
      setMagicLinkError(null)

      try {
        const res = await fetch('/api/auth/magic-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: info.email }),
        })

        if (!res.ok) {
          const data = (await res.json()) as { error: string }
          throw new Error(data.error)
        }

        setMagicLinkSent(true)
      } catch (err) {
        setMagicLinkError(err instanceof Error ? err.message : t('errors.genericError'))
      } finally {
        setSendingMagicLink(false)
      }
    },
    [info, t],
  )

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
          <div className="wave-spinner mx-auto" />
          <p className="mt-4 text-[var(--text-secondary)]">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Error / not found state
  if (error || !info) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
          <p className="text-lg font-semibold text-[var(--color-error)]">{error ?? t('invite.invalidToken')}</p>
          <button
            type="button"
            onClick={() => void navigate({ to: '/login' })}
            className="neo-btn shadow-neo-button mt-6 rounded-full bg-[var(--surface)] px-8 py-3"
          >
            {t('verify.backToLogin')}
          </button>
        </div>
      </div>
    )
  }

  // Expired state
  if (info.expired) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="shadow-neo-panel w-full max-w-md rounded-[2rem] bg-[var(--surface)] p-10 text-center">
          <p className="text-lg font-semibold text-[var(--color-error)]">{t('invite.expired')}</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('invite.expiredHint')}</p>
          <button
            type="button"
            onClick={() => void navigate({ to: '/login' })}
            className="neo-btn shadow-neo-button mt-6 rounded-full bg-[var(--surface)] px-8 py-3"
          >
            {t('verify.backToLogin')}
          </button>
        </div>
      </div>
    )
  }

  // Authenticated — accept invitation
  if (authToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="shadow-neo-panel w-full max-w-md rounded-[2rem] bg-[var(--surface)] p-10 text-center">
          <h1 className="font-display text-2xl tracking-tight">{t('invite.joinTeam', { teamName: info.teamName })}</h1>
          <p className="mt-3 text-[var(--text-secondary)]">{t('invite.invitedBy', { name: info.inviterName })}</p>

          {accepted && <p className="mt-4 font-semibold text-[var(--color-success)]">{t('invite.accepted')}</p>}

          {acceptError && <p className="mt-4 text-sm text-[var(--color-error)]">{acceptError}</p>}

          {!accepted && (
            <button
              type="button"
              disabled={accepting}
              onClick={() => void handleAccept()}
              className="neo-btn shadow-neo-button mt-6 w-full rounded-full bg-[var(--surface)] px-6 py-3 font-semibold transition-opacity disabled:opacity-50"
            >
              {accepting ? t('invite.accepting') : t('invite.accept')}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Not authenticated — send magic link
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="shadow-neo-panel w-full max-w-md rounded-[2rem] bg-[var(--surface)] p-10">
        <h1 className="font-display text-center text-2xl tracking-tight">
          {t('invite.signInToJoin', { teamName: info.teamName })}
        </h1>
        <p className="mt-2 text-center text-[var(--text-secondary)]">
          {t('invite.invitedBy', { name: info.inviterName })}
        </p>

        {magicLinkSent ? (
          <div className="mt-8 text-center">
            <div className="shadow-neo-inset mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <Icon name="envelope" size="xl" label={t('login.emailSentAria')} />
            </div>
            <p className="mt-4 font-semibold">{t('login.checkEmail')}</p>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">
              {t('login.magicLinkSent')} <strong>{info.email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMagicLink} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="invite-email"
                className="mb-2 block text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]"
              >
                {t('login.emailLabel')}
              </label>
              <input
                id="invite-email"
                type="email"
                value={info.email}
                readOnly
                className="input-embossed w-full px-6 py-3 text-[var(--text-primary)] opacity-70"
              />
            </div>

            {magicLinkError && <p className="text-sm text-[var(--color-error)]">{magicLinkError}</p>}

            <button
              type="submit"
              disabled={sendingMagicLink}
              className="neo-btn shadow-neo-button w-full rounded-full bg-[var(--surface)] px-6 py-3 font-semibold transition-opacity disabled:opacity-50"
            >
              {sendingMagicLink ? t('common.sending') : t('login.sendMagicLink')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
