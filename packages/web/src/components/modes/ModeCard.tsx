import { Link } from '@tanstack/react-router'
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
}

export function ModeCard({
  slug,
  name,
  purpose,
  flowName,
  timeEstimateMinutes,
  frameworkName,
  frameworkColor,
}: ModeCardProps) {
  return (
    <Link
      to="/modes/$slug"
      params={{ slug }}
      className="shadow-neo-well wave-card-hover block rounded-[1.8rem] bg-[var(--surface)] p-6 transition-colors"
    >
      {/* Framework badge */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: frameworkColor }} />
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">{frameworkName}</span>
        <span className="text-xs text-[var(--text-tertiary)]">·</span>
        <span className="text-xs text-[var(--text-tertiary)]">{flowName}</span>
      </div>

      {/* Mode name */}
      <h3 className="font-display mt-3 text-xl">{name}</h3>

      {/* Purpose */}
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{purpose}</p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
        <span className="inline-flex items-center gap-1">
          <Icon name="timer" size="xs" /> {timeEstimateMinutes} min
        </span>
      </div>
    </Link>
  )
}
