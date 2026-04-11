import { Link, useLocation } from '@tanstack/react-router'
import { Icon, type IconName } from '../ui/Icon'

const NAV_ITEMS: Array<{
  to: '/' | '/modes' | '/coach' | '/assessments' | '/programs' | '/progress' | '/activity' | '/teams'
  label: string
  icon: IconName
}> = [
  { to: '/', label: 'Dashboard', icon: 'house' },
  { to: '/modes', label: 'Modes', icon: 'lightning' },
  { to: '/coach', label: 'Alicia', icon: 'brain' },
  { to: '/assessments', label: 'Assess', icon: 'clipboard-text' },
  { to: '/programs', label: 'Programs', icon: 'book-open-text' },
  { to: '/progress', label: 'Progress', icon: 'chart-line-up' },
  { to: '/activity', label: 'Activity', icon: 'list-bullets' },
  { to: '/teams', label: 'Teams', icon: 'users-three' },
]

export function Nav() {
  const location = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col" aria-label="Main navigation">
        <div className="flex flex-1 flex-col gap-1 px-4 py-6">
          {/* Logo */}
          <Link to="/" className="mb-6 px-3">
            <h1 className="font-display text-xl tracking-tight">Synergy</h1>
            <p className="text-xs text-[var(--text-tertiary)]">7 Flows</p>
          </Link>

          {/* Nav items */}
          {NAV_ITEMS.map((item) => {
            const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'shadow-neo-embossed font-semibold text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon name={item.icon} size="md" />
                {item.label}
              </Link>
            )
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings */}
          <Link
            to="/settings"
            aria-current={location.pathname.startsWith('/settings') ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              location.pathname.startsWith('/settings')
                ? 'shadow-neo-embossed font-semibold text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon name="gear" size="md" />
            Settings
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav — all items visible, horizontally scrollable */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex overflow-x-auto scrollbar-hide border-t border-[var(--zinc-300)] bg-[var(--surface)] md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 py-3 text-[10px] ${
                isActive ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              }`}
            >
              <Icon name={item.icon} size="lg" />
              {item.label}
            </Link>
          )
        })}
        {/* Settings as last mobile nav item */}
        <Link
          to="/settings"
          aria-current={location.pathname.startsWith('/settings') ? 'page' : undefined}
          className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 py-3 text-[10px] ${
            location.pathname.startsWith('/settings')
              ? 'font-semibold text-[var(--text-primary)]'
              : 'text-[var(--text-tertiary)]'
          }`}
        >
          <Icon name="gear" size="lg" />
          Settings
        </Link>
      </nav>
    </>
  )
}
