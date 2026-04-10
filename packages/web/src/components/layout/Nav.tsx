import { Link, useLocation } from '@tanstack/react-router'
import { useThemeStore } from '../../hooks/use-theme'
import { useAuthStore } from '../../stores/auth'

const NAV_ITEMS = [
  { to: '/' as const, label: 'Dashboard', icon: '◉' },
  { to: '/modes' as const, label: 'Modes', icon: '◆' },
  { to: '/coach' as const, label: 'Alicia', icon: '◈' },
  { to: '/assessments' as const, label: 'Assess', icon: '◇' },
  { to: '/programs' as const, label: 'Programs', icon: '▣' },
  { to: '/progress' as const, label: 'Progress', icon: '○' },
  { to: '/teams' as const, label: 'Teams', icon: '⬡' },
]

export function Nav() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { theme, setTheme } = useThemeStore()

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
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'shadow-neo-embossed font-semibold text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Theme toggle */}
          <div className="flex gap-1 rounded-full p-1">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`flex-1 rounded-full px-2 py-1.5 text-xs capitalize transition-all ${
                  theme === t ? 'shadow-neo-embossed font-semibold' : 'text-[var(--text-tertiary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Settings + logout */}
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <span className="w-5 text-center">⚙</span>
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAuth()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <span className="w-5 text-center">↪</span>
            Sign out
          </button>

          {/* User */}
          {user && (
            <div className="mt-2 border-t border-[var(--zinc-300)] pt-3 px-3">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-[var(--zinc-300)] bg-[var(--surface)] md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
                isActive ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
