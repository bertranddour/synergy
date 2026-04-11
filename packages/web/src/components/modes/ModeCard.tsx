import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '../ui/Icon'

interface ModeCardProps {
  slug: string
  name: string
  purpose: string
  flowName: string
  timeEstimateMinutes: number
  frameworkSlug: string
  frameworkName: string
  frameworkColor: string
  isRecommended?: boolean
}

export function ModeCard({
  slug,
  flowName,
  timeEstimateMinutes,
  frameworkSlug,
  frameworkColor,
  isRecommended,
}: ModeCardProps) {
  const { t } = useTranslation()
  return (
    <Link
      to="/modes/$slug"
      params={{ slug }}
      className="shadow-neo-well wave-card-hover block rounded-[1.8rem] bg-[var(--surface)] p-6 transition-colors"
    >
      {/* Framework badge */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: frameworkColor }} />
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
          {t(`frameworks.${frameworkSlug}.name`)}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">·</span>
        <span className="text-xs text-[var(--text-tertiary)]">{t(`flowNames.${flowName}`)}</span>
      </div>

      {/* Mode name */}
      <h3 className="font-display mt-3 text-xl">{t(`modeContent.${slug}.name`)}</h3>

      {/* Purpose */}
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{t(`modeContent.${slug}.purpose`)}</p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
        <span className="inline-flex items-center gap-1">
          <Icon name="timer" size="xs" /> {t('common.min', { count: timeEstimateMinutes })}
        </span>
        {isRecommended && (
          <span className="rounded-full bg-[var(--color-synergy)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-synergy)]">
            {t('modes.recommended')}
          </span>
        )}
      </div>
    </Link>
  )
}
