import { createRootRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import '../styles/global.css'
import { useAuthStore } from '../stores/auth'

export const Route = createRootRoute({
  component: RootLayout,
})

const PUBLIC_ROUTES = ['/login', '/verify']

function RootLayout() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some((r) => location.pathname.startsWith(r))
    if (!token && !isPublic) {
      void navigate({ to: '/login' })
    }
  }, [token, location.pathname, navigate])

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      <Outlet />
    </div>
  )
}
