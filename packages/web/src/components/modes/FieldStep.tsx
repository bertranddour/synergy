import { useState } from 'react'

interface FieldStepProps {
  index: number
  total: number
  name: string
  description: string
  type: string
  required: boolean
  example?: string
  options?: string[]
  value: unknown
  onSubmit: (value: unknown) => void
  isLast: boolean
}

export function FieldStep({
  index,
  total,
  name,
  description,
  type,
  example,
  options,
  value,
  onSubmit,
  isLast,
}: FieldStepProps) {
  const [inputValue, setInputValue] = useState<string>(
    typeof value === 'string' ? value : '',
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[60vh] flex-col justify-center">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span className="uppercase tracking-[0.3em]">
            Field {index + 1} of {total}
          </span>
          <span>{Math.round(((index + 1) / total) * 100)}%</span>
        </div>
        <div className="shadow-neo-inset mt-2 h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-[var(--color-core)] transition-all duration-500"
            style={{
              width: `${((index + 1) / total) * 100}%`,
              transitionTimingFunction: 'var(--wave-ease)',
            }}
          />
        </div>
      </div>

      {/* Field header */}
      <h2 className="font-display text-2xl md:text-3xl">{name}</h2>
      <p className="mt-3 text-[var(--text-secondary)]">{description}</p>
      {example && (
        <p className="mt-2 text-sm italic text-[var(--text-tertiary)]">
          Example: {example}
        </p>
      )}

      {/* Input */}
      <div className="mt-8">
        {type === 'select' && options ? (
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInputValue(option)}
                className={`neo-btn block w-full rounded-[1.2rem] p-4 text-left transition-all ${
                  inputValue === option
                    ? 'shadow-neo-inset font-semibold'
                    : 'shadow-neo-button'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : type === 'textarea' ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={6}
            className="shadow-neo-inset w-full resize-none rounded-[1.2rem] bg-[var(--surface)] p-6 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            placeholder={`Enter ${name.toLowerCase()}...`}
          />
        ) : type === 'number' ? (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-embossed w-full px-6 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            placeholder={`Enter ${name.toLowerCase()}...`}
          />
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-embossed w-full px-6 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            placeholder={`Enter ${name.toLowerCase()}...`}
          />
        )}
      </div>

      {/* Submit button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={!inputValue}
          className="neo-btn shadow-neo-button rounded-full px-10 py-3.5 font-semibold transition-opacity disabled:opacity-40"
        >
          {isLast ? 'Complete' : 'Next'}
        </button>
      </div>
    </form>
  )
}
