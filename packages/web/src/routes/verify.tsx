import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/auth'

export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: VerifyPage,
})

function VerifyPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Missing verification token')
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
          }
        }

        setAuth(data.token, data.user)
        void navigate({ to: data.user.onboardingCompleted ? '/' : '/onboarding' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed')
      }
    }

    void verify()
  }, [token, navigate, setAuth])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10 text-center">
        {error ? (
          <>
            <p className="text-lg font-semibold text-[var(--color-error)]">Verification failed</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
            <button
              type="button"
              onClick={() => void navigate({ to: '/login' })}
              className="neo-btn shadow-neo-button mt-6 rounded-full bg-[var(--surface)] px-8 py-3"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div className="wave-spinner mx-auto" />
            <p className="mt-4 text-[var(--text-secondary)]">Verifying your magic link...</p>
          </>
        )}
      </div>
    </div>
  )
}
