import { FRAMEWORK_COLORS, FRAMEWORK_NAMES, type FrameworkSlug } from '@synergy/shared'

interface FrameworkToggleProps {
  slug: FrameworkSlug
  active: boolean
  onToggle: () => void
  disabled?: boolean
}

export function FrameworkToggle({ slug, active, onToggle, disabled }: FrameworkToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`w-full rounded-[1.5rem] p-5 text-left transition-all ${
        active ? 'shadow-neo-embossed' : 'shadow-neo-well wave-card-hover'
      } disabled:opacity-50`}
    >
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: FRAMEWORK_COLORS[slug] }} />
        <div className="flex-1">
          <span className="font-display text-lg">{FRAMEWORK_NAMES[slug]}</span>
        </div>
        {/* Toggle switch */}
        <div
          className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
            active ? 'bg-[var(--color-health-green)]' : 'bg-[var(--zinc-300)]'
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-[var(--surface)] shadow-neo-button transition-transform ${
              active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--text-tertiary)]">
        {active ? 'Active — modes and health tracking enabled' : 'Tap to activate'}
      </p>
    </button>
  )
}
