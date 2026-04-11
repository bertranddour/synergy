import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import '../i18n'
import '../styles/global.css'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'

export const Route = createRootRoute({
  component: RootLayout,
})

const PUBLIC_ROUTES = ['/login', '/verify', '/onboarding']

function RootLayout() {
  const { token } = useAuthStore()
  const locale = useLocaleStore((s) => s.locale)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some((r) => location.pathname.startsWith(r))
    if (!token && !isPublic) {
      void navigate({ to: '/login' })
    }
  }, [token, location.pathname, navigate])

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
          <div className="wave-spinner" />
        </div>
      }
    >
      <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)]">
        <Outlet />
      </div>
    </Suspense>
  )
}
