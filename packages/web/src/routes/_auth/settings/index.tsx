import { FRAMEWORK_COLORS, type FrameworkSlug } from '@synergy/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../../hooks/use-theme'
import { SUPPORTED_LANGUAGES } from '../../../i18n/languages'
import { useAuthStore } from '../../../stores/auth'
import { useLocaleStore } from '../../../stores/locale'

export const Route = createFileRoute('/_auth/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t } = useTranslation()
  const { user, token, updateUser, clearAuth } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const { locale, setLocale } = useLocaleStore()
  const queryClient = useQueryClient()

  const frameworksQuery = useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      const res = await fetch('/api/users/me/frameworks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        frameworks: Array<{ slug: string; name: string; active: boolean; activatedAt: string | null }>
      }>
    },
  })

  const toggleFramework = useMutation({
    mutationFn: async (params: { slug: string; active: boolean }) => {
      if (params.active) {
        await fetch('/api/users/me/frameworks', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ frameworkSlug: params.slug }),
        })
      } else {
        await fetch(`/api/users/me/frameworks/${params.slug}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['frameworks'] })
      void queryClient.invalidateQueries({ queryKey: ['health'] })
      void queryClient.invalidateQueries({ queryKey: ['modes'] })
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (data: { name?: string; stage?: string; teamSize?: number; locale?: string }) => {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json() as Promise<Record<string, unknown>>
    },
    onSuccess: (data: Record<string, unknown>) => {
      updateUser({ name: data.name as string, stage: data.stage as string })
    },
  })

  const allFrameworks = Object.keys(FRAMEWORK_COLORS) as FrameworkSlug[]
  const activeSet = new Set(frameworksQuery.data?.frameworks.filter((f) => f.active).map((f) => f.slug) ?? [])

  const THEME_KEYS = ['light', 'dark', 'system'] as const
  const STAGE_KEYS = ['solo', 'small-team', 'growing', 'scaling'] as const

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight">{t('settings.title')}</h1>
      </div>

      {/* Profile */}
      <section className="wave-entrance-2 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('settings.profile')}</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">{t('settings.name')}</label>
            <input
              type="text"
              defaultValue={user?.name}
              onBlur={(e) => {
                if (e.target.value !== user?.name) {
                  updateProfile.mutate({ name: e.target.value })
                }
              }}
              className="input-embossed w-full max-w-sm px-5 py-2.5 text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">{t('settings.email')}</label>
            <p className="text-[var(--text-primary)]">{user?.email}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--text-secondary)]">{t('settings.stage')}</label>
            <div className="flex gap-2">
              {STAGE_KEYS.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => updateProfile.mutate({ stage })}
                  className={`neo-btn rounded-full px-4 py-2 text-xs ${
                    user?.stage === stage
                      ? 'shadow-neo-embossed font-semibold'
                      : 'shadow-neo-button text-[var(--text-tertiary)]'
                  }`}
                >
                  {t(`stages.${stage}.label`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="wave-entrance-3 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('settings.frameworks')}</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('settings.frameworksHint')}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {allFrameworks.map((slug) => {
            const isActive = activeSet.has(slug)
            return (
              <button
                key={slug}
                type="button"
                onClick={() => toggleFramework.mutate({ slug, active: !isActive })}
                className={`rounded-[1.5rem] p-5 text-left transition-all ${
                  isActive ? 'shadow-neo-embossed' : 'shadow-neo-well'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: FRAMEWORK_COLORS[slug] }} />
                  <span className="font-semibold">{t(`frameworks.${slug}.name`)}</span>
                  <span
                    className={`ml-auto rounded-full px-3 py-0.5 text-xs ${
                      isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    {isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Theme */}
      <section className="wave-entrance-4 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('settings.appearance')}</h2>
        <div className="mt-4 flex gap-3">
          {THEME_KEYS.map((themeKey) => (
            <button
              key={themeKey}
              type="button"
              onClick={() => setTheme(themeKey)}
              className={`neo-btn flex-1 rounded-xl px-4 py-3 text-sm ${
                theme === themeKey
                  ? 'shadow-neo-embossed font-semibold'
                  : 'shadow-neo-button text-[var(--text-tertiary)]'
              }`}
            >
              {t(`settings.theme${themeKey.charAt(0).toUpperCase()}${themeKey.slice(1)}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="wave-entrance-4 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('settings.language')}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLocale(lang.code)
                updateProfile.mutate({ locale: lang.code })
              }}
              className={`neo-btn rounded-xl px-4 py-3 text-sm ${
                locale === lang.code
                  ? 'shadow-neo-embossed font-semibold'
                  : 'shadow-neo-button text-[var(--text-tertiary)]'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </section>

      {/* Account */}
      <section className="wave-entrance-5 shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{t('settings.account')}</h2>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              clearAuth()
              window.location.href = '/login'
            }}
            className="neo-btn shadow-neo-button rounded-full px-6 py-2.5 text-sm text-[var(--text-secondary)]"
          >
            {t('settings.signOut')}
          </button>
          <button
            type="button"
            onClick={async () => {
              const res = await fetch('/api/users/me/export', {
                headers: { Authorization: `Bearer ${token}` },
              })
              if (!res.ok) return
              const data = await res.json()
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'synergy-data-export.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="neo-btn shadow-neo-button rounded-full px-6 py-2.5 text-sm text-[var(--text-tertiary)]"
          >
            {t('settings.exportData')}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!window.confirm(t('settings.deleteConfirm'))) return
              const res = await fetch('/api/users/me', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
              if (res.ok) {
                clearAuth()
                window.location.href = '/login'
              }
            }}
            className="neo-btn shadow-neo-button rounded-full px-6 py-2.5 text-sm text-[var(--color-error)]"
          >
            {t('settings.deleteAccount')}
          </button>
        </div>
      </section>
    </div>
  )
}
