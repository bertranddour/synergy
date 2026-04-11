import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupportedLocale } from '../i18n/languages'
import { SUPPORTED_LOCALE_CODES } from '../i18n/languages'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'

export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: VerifyPage,
})

function VerifyPage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setLocale = useLocaleStore((s) => s.setLocale)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError(t('verify.missingToken'))
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
        if (!res.ok) {
          const data = (await res.json()) as { error: string }
          throw new Error(data.error)
        }

        const data = (await res.json()) as {
          token: string
          user: {
            id: string
            email: string
            name: string
            avatarUrl: string | null
            stage: string
            teamSize: number
            onboardingCompleted: boolean
            locale: string
          }
          autoJoinedTeams?: Array<{ id: string; name: string }>
        }

        setAuth(data.token, data.user)
        // Sync locale from user profile
        const userLocale = data.user.locale as string
        if (SUPPORTED_LOCALE_CODES.includes(userLocale as SupportedLocale)) {
          setLocale(userLocale as SupportedLocale)
        }
        const firstTeam = data.autoJoinedTeams?.[0]
        if (firstTeam) {
          void navigate({ to: '/teams/$id', params: { id: firstTeam.id } })
        } else {
          void navigate({ to: data.user.onboardingCompleted ? '/' : '/onboarding' })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('verify.failed'))
      }
    }

    void verify()
  }, [token, navigate, setAuth, setLocale, t])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
        {error ? (
          <>
            <p className="text-lg font-semibold text-[var(--color-error)]">{t('verify.failed')}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
            <button
              type="button"
              onClick={() => void navigate({ to: '/login' })}
              className="neo-btn shadow-neo-button mt-6 rounded-full bg-[var(--surface)] px-8 py-3"
            >
              {t('verify.backToLogin')}
            </button>
          </>
        ) : (
          <>
            <div className="wave-spinner mx-auto" />
            <p className="mt-4 text-[var(--text-secondary)]">{t('verify.verifying')}</p>
          </>
        )}
      </div>
    </div>
  )
}
