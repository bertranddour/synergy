import { FRAMEWORK_COLORS, type FrameworkSlug } from '@synergy/shared'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModeCard } from '../../../components/modes/ModeCard'
import { useAuthStore } from '../../../stores/auth'

export const Route = createFileRoute('/_auth/modes/')({
  component: ModeLibrary,
})

interface ModeListItem {
  id: string
  slug: string
  name: string
  purpose: string
  flowName: string
  timeEstimateMinutes: number
  sortOrder: number
  frameworkSlug: string
  frameworkName: string
  frameworkColor: string
}

function ModeLibrary() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)
  const [activeFilter, setActiveFilter] = useState<FrameworkSlug | null>(null)
  const [search, setSearch] = useState('')
  const [showRecommended, setShowRecommended] = useState(false)

  // Fetch health data for recommended modes (cached 5min, same as dashboard)
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/health', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return null
      return res.json() as Promise<{
        categories: Array<{ recommendedModes: string[] }>
      }>
    },
    staleTime: 5 * 60 * 1000,
  })

  const recommendedSlugs = new Set(healthQuery.data?.categories.flatMap((c) => c.recommendedModes) ?? [])

  // Fetch user's active frameworks
  const frameworksQuery = useQuery({
    queryKey: ['user-frameworks'],
    queryFn: async () => {
      const res = await fetch('/api/users/me/frameworks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return []
      const data = (await res.json()) as {
        frameworks: Array<{ slug: string; active: boolean }>
      }
      return data.frameworks.filter((f) => f.active).map((f) => f.slug as FrameworkSlug)
    },
    staleTime: 5 * 60 * 1000,
  })

  const activeFrameworkSlugs = frameworksQuery.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['modes', activeFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeFilter) params.set('framework', activeFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/modes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch modes')
      return res.json() as Promise<{ modes: ModeListItem[]; total: number }>
    },
  })

  return (
    <div className="space-y-8">
      <div className="wave-entrance-1">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">{t('modes.title')}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{t('modes.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="wave-entrance-2 flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder={t('modes.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-embossed flex-1 px-6 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] min-w-[200px]"
        />

        {/* Framework toggles */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter(null)}
            className={`neo-btn rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              activeFilter === null
                ? 'shadow-neo-button font-semibold text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)]'
            }`}
          >
            {t('modes.all')}
          </button>
          <button
            type="button"
            onClick={() => setShowRecommended((v) => !v)}
            className={`neo-btn rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              showRecommended ? 'shadow-neo-button font-semibold' : 'text-[var(--text-tertiary)]'
            }`}
            style={showRecommended ? { color: 'var(--color-synergy)' } : undefined}
          >
            {t('modes.recommended')}
          </button>
          {activeFrameworkSlugs.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveFilter(activeFilter === slug ? null : slug)}
              className={`neo-btn rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                activeFilter === slug ? 'shadow-neo-button font-semibold' : 'text-[var(--text-tertiary)]'
              }`}
              style={activeFilter === slug ? { color: FRAMEWORK_COLORS[slug] } : undefined}
            >
              {t(`frameworks.${slug}.name`)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="wave-skeleton h-48 rounded-[1.8rem]" />
          ))}
        </div>
      ) : data?.modes.length === 0 ? (
        <div className="shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">
            {search ? t('modes.noResults', { search }) : t('modes.activateHint')}
          </p>
        </div>
      ) : (
        <div className="wave-entrance-3 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.modes
            .filter((mode) => !showRecommended || recommendedSlugs.has(mode.slug))
            .map((mode) => (
              <ModeCard
                key={mode.id}
                slug={mode.slug}
                name={mode.name}
                purpose={mode.purpose}
                flowName={mode.flowName}
                timeEstimateMinutes={mode.timeEstimateMinutes}
                frameworkName={mode.frameworkName}
                frameworkColor={mode.frameworkColor}
                isRecommended={recommendedSlugs.has(mode.slug)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
