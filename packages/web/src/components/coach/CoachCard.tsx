import { useTranslation } from 'react-i18next'

interface CoachCardProps {
  message: string
  isStreaming: boolean
  onDismiss: () => void
}

export function CoachCard({ message, isStreaming, onDismiss }: CoachCardProps) {
  const { t } = useTranslation()
  return (
    <div className="wave-entrance-1 mt-6 rounded-[1.5rem] border-l-4 border-[var(--color-synergy)] bg-[var(--surface)] p-5 shadow-neo-well">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--color-synergy)' }}
        >
          A
        </div>
        <div className="flex-1">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]" aria-live="polite">
            {message}
            {isStreaming && <span className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-[var(--color-synergy)]" />}
          </p>
        </div>
        {!isStreaming && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            aria-label={t('coach.dismissAria')}
          >
            {t('coach.continue')}
          </button>
        )}
      </div>
    </div>
  )
}
