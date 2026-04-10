interface ProgressRingsProps {
  completion: number // 0-100
  consistency: number // streak weeks
  growth: number // 0-100
}

interface RingProps {
  radius: number
  strokeWidth: number
  progress: number
  color: string
}

function Ring({ radius, strokeWidth, progress, color }: RingProps) {
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <circle
      stroke={color}
      fill="transparent"
      strokeWidth={strokeWidth}
      strokeDasharray={`${circumference} ${circumference}`}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      r={normalizedRadius}
      cx={radius}
      cy={radius}
      style={{
        transition: `stroke-dashoffset var(--wave-duration-slow) var(--wave-ease)`,
        transform: 'rotate(-90deg)',
        transformOrigin: `${radius}px ${radius}px`,
      }}
    />
  )
}

function TrackRing({ radius, strokeWidth }: { radius: number; strokeWidth: number }) {
  const normalizedRadius = radius - strokeWidth / 2
  return (
    <circle
      stroke="var(--zinc-300)"
      fill="transparent"
      strokeWidth={strokeWidth}
      r={normalizedRadius}
      cx={radius}
      cy={radius}
      opacity={0.3}
    />
  )
}

export function ProgressRings({ completion, consistency, growth }: ProgressRingsProps) {
  const size = 200

  // Normalize consistency to 0-100 (max 12 weeks = 100%)
  const consistencyPercent = Math.min(100, (consistency / 12) * 100)

  return (
    <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
        Progress Rings
      </p>

      <div className="mt-6 flex items-center justify-center gap-8">
        {/* Rings SVG */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer ring: Completion (blue) */}
          <TrackRing radius={95} strokeWidth={12} />
          <Ring radius={95} strokeWidth={12} progress={completion} color="var(--color-core)" />

          {/* Middle ring: Consistency (green) */}
          <TrackRing radius={78} strokeWidth={12} />
          <Ring radius={78} strokeWidth={12} progress={consistencyPercent} color="var(--color-health-green)" />

          {/* Inner ring: Growth (amber) */}
          <TrackRing radius={61} strokeWidth={12} />
          <Ring radius={61} strokeWidth={12} progress={growth} color="var(--color-synergy)" />
        </svg>

        {/* Legend */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-core)' }} />
              <span className="text-sm font-semibold">{completion}%</span>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Completion</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-health-green)' }} />
              <span className="text-sm font-semibold">{consistency}w</span>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Streak</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-synergy)' }} />
              <span className="text-sm font-semibold">{growth}%</span>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Growth</span>
          </div>
        </div>
      </div>
    </div>
  )
}
