interface HealthCardProps {
  name: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
  color: 'green' | 'yellow' | 'orange' | 'red'
  topMetrics: Array<{ name: string; value: number; unit: string }>
}

import { Icon, type IconName } from '../ui/Icon'

const TREND_ICONS: Record<string, IconName> = {
  improving: 'trend-up',
  stable: 'equals',
  declining: 'trend-down',
}

const COLOR_MAP = {
  green: 'var(--color-health-green)',
  yellow: 'var(--color-health-yellow)',
  orange: 'var(--color-health-orange)',
  red: 'var(--color-health-red)',
}

export function HealthCard({ name, score, trend, color, topMetrics }: HealthCardProps) {
  return (
    <div className="shadow-neo-well wave-card-hover rounded-[1.8rem] bg-[var(--surface)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          {name.replace('-', ' ')} Health
        </span>
        <span
          style={{
            color:
              trend === 'improving' ? COLOR_MAP.green : trend === 'declining' ? COLOR_MAP.red : 'var(--text-tertiary)',
          }}
        >
          <Icon name={TREND_ICONS[trend] ?? 'equals'} size="md" />
        </span>
      </div>

      {/* Score */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-body text-4xl font-bold" style={{ color: COLOR_MAP[color] }}>
          {score}
        </span>
        <span className="text-sm text-[var(--text-tertiary)]">/100</span>
      </div>

      {/* Progress bar */}
      <div className="shadow-neo-inset mt-3 h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: COLOR_MAP[color],
            transitionTimingFunction: 'var(--wave-ease)',
          }}
        />
      </div>

      {/* Top metrics */}
      {topMetrics.length > 0 && (
        <div className="mt-4 space-y-1">
          {topMetrics.slice(0, 3).map((m) => (
            <div key={m.name} className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>{m.name.replace(/_/g, ' ')}</span>
              <span>
                {m.value} {m.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
