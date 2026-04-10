import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/auth'

export const Route = createFileRoute('/_auth/')({
  component: Dashboard,
})

function Dashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Your business health at a glance
        </p>
      </div>

      {/* Health cards will be added in Phase 2 */}
      <div className="wave-entrance-2 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
            Health Dashboard
          </p>
          <p className="mt-4 text-[var(--text-secondary)]">
            Complete your first mode to start tracking health.
          </p>
        </div>
      </div>

      {/* Progress rings will be added in Phase 2 */}
      <div className="wave-entrance-3 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          Progress Rings
        </p>
        <p className="mt-4 text-[var(--text-secondary)]">
          Your rings will appear after completing modes.
        </p>
      </div>
    </div>
  )
}
