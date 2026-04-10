import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Nav } from '../components/layout/Nav'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen">
      <Nav />
      {/* Main content — offset for sidebar on desktop, bottom nav on mobile */}
      <main className="pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
