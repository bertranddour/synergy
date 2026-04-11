import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from '../ui/Icon'

const NAV_ITEMS: Array<{
  to: '/' | '/modes' | '/coach' | '/assessments' | '/programs' | '/progress' | '/activity' | '/teams'
  labelKey: string
  icon: IconName
}> = [
  { to: '/', labelKey: 'nav.dashboard', icon: 'house' },
  { to: '/modes', labelKey: 'nav.modes', icon: 'lightning' },
  { to: '/coach', labelKey: 'nav.coach', icon: 'brain' },
  { to: '/assessments', labelKey: 'nav.assess', icon: 'clipboard-text' },
  { to: '/programs', labelKey: 'nav.programs', icon: 'book-open-text' },
  { to: '/progress', labelKey: 'nav.progress', icon: 'chart-line-up' },
  { to: '/activity', labelKey: 'nav.activity', icon: 'list-bullets' },
  { to: '/teams', labelKey: 'nav.teams', icon: 'users-three' },
]

export function Nav() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col"
        aria-label={t('nav.mainNavigation')}
      >
        <div className="flex flex-1 flex-col gap-1 px-4 py-6">
          {/* Logo */}
          <Link to="/" className="mb-6 px-3">
            <h1 className="font-display text-xl tracking-tight">{t('common.appName')}</h1>
            <p className="text-xs text-[var(--text-tertiary)]">{t('common.appTagline')}</p>
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
                {t(item.labelKey)}
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
            {t('nav.settings')}
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav — all items visible, horizontally scrollable */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex overflow-x-auto scrollbar-hide border-t border-[var(--zinc-300)] bg-[var(--surface)] md:hidden"
        aria-label={t('nav.mobileNavigation')}
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
              {t(item.labelKey)}
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
          {t('nav.settings')}
        </Link>
      </nav>
    </>
  )
}
