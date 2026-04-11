import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>(typeof value === 'string' ? value : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[60vh] flex-col justify-center">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span className="uppercase tracking-[0.3em]">{t('fields.fieldOf', { current: index + 1, total })}</span>
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
      {example && <p className="mt-2 text-sm italic text-[var(--text-tertiary)]">{t('modes.example', { example })}</p>}

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
                  inputValue === option ? 'shadow-neo-inset font-semibold' : 'shadow-neo-button'
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
            placeholder={t('fields.enterPlaceholder', {
              name: name.toLowerCase(),
            })}
          />
        ) : type === 'number' ? (
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            aria-label={name}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-embossed w-full px-6 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            placeholder={t('fields.enterPlaceholder', {
              name: name.toLowerCase(),
            })}
          />
        ) : type === 'toggle' ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setInputValue(inputValue === 'true' ? 'false' : 'true')}
              className={`neo-btn h-12 w-20 rounded-full transition-all ${
                inputValue === 'true' ? 'shadow-neo-inset bg-[var(--color-core)]' : 'shadow-neo-button'
              }`}
              aria-label={`Toggle ${name}`}
              aria-pressed={inputValue === 'true'}
            >
              <span
                className={`block h-8 w-8 rounded-full bg-[var(--surface)] shadow-neo-button transition-transform ${
                  inputValue === 'true' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-[var(--text-secondary)]">
              {inputValue === 'true' ? t('common.yes') : t('common.no')}
            </span>
          </div>
        ) : type === 'structured' ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={8}
            aria-label={name}
            className="shadow-neo-inset w-full resize-none rounded-[1.2rem] bg-[var(--surface)] p-6 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            placeholder={t('fields.structuredPlaceholder', {
              name: name.toLowerCase(),
            })}
          />
        ) : (
          <input
            type="text"
            aria-label={name}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-embossed w-full px-6 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            placeholder={t('fields.enterPlaceholder', {
              name: name.toLowerCase(),
            })}
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
          {isLast ? t('common.complete') : t('common.next')}
        </button>
      </div>
    </form>
  )
}
