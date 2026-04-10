interface ScenarioCardProps {
  description: string
  options: { a: string; b: string; c: string; d: string }
  selectedAnswer: string | undefined
  onSelect: (answer: string) => void
}

const OPTION_KEYS = ['a', 'b', 'c', 'd'] as const

export function ScenarioCard({ description, options, selectedAnswer, onSelect }: ScenarioCardProps) {
  return (
    <div>
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-8">
        <p className="text-lg leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 space-y-3">
        {OPTION_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`neo-btn w-full rounded-[1.2rem] p-5 text-left transition-all ${
              selectedAnswer === key ? 'shadow-neo-embossed' : 'shadow-neo-well'
            }`}
          >
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase shadow-neo-button">
                {key}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{options[key]}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
