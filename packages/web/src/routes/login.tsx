import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '../components/ui/Icon'
import { useAuthStore } from '../stores/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { token } = useAuthStore()

  // Redirect if already logged in
  if (token) {
    void navigate({ to: '/' })
    return null
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        throw new Error(data.error)
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="shadow-neo-panel w-full max-w-md rounded-[2rem] bg-[var(--surface)] p-10">
        <h1 className="font-display text-center text-3xl tracking-tight">{t('login.title')}</h1>
        <p className="mt-2 text-center text-[var(--text-secondary)]">{t('login.subtitle')}</p>

        {sent ? (
          <div className="mt-8 text-center">
            <div className="shadow-neo-inset mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <Icon name="envelope" size="xl" label={t('login.emailSentAria')} />
            </div>
            <p className="mt-4 font-semibold">{t('login.checkEmail')}</p>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">
              {t('login.magicLinkSent')} <strong>{email}</strong>
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-[var(--text-secondary)] underline"
            >
              {t('login.differentEmail')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]"
              >
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="input-embossed w-full px-6 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

            <button
              type="submit"
              disabled={loading || !email}
              className="neo-btn shadow-neo-button w-full rounded-full bg-[var(--surface)] px-6 py-3 font-semibold transition-opacity disabled:opacity-50"
            >
              {loading ? t('common.sending') : t('login.sendMagicLink')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
