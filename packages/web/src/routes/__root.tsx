import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../styles/global.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      <Outlet />
    </div>
  )
}
