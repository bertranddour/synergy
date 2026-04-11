import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '../ui/Icon'

interface NudgeCardProps {
  id: string
  triggerType: string
  title: string
  message: string
  suggestedModeSlug: string | null
}

export function NudgeCard({ id, title, message, suggestedModeSlug }: NudgeCardProps) {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  const dismiss = useMutation({
    mutationFn: async () => {
      await fetch(`/api/coach/proactive/${id}/dismiss`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['proactive'] })
    },
  })

  return (
    <div className="shadow-neo-well rounded-[1.5rem] border-l-4 border-[var(--color-synergy)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => dismiss.mutate()}
          className="shrink-0 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          {t('nudge.dismiss')}
        </button>
      </div>
      {suggestedModeSlug && (
        <Link
          to="/modes/$slug"
          params={{ slug: suggestedModeSlug }}
          className="neo-btn shadow-neo-button mt-3 inline-block rounded-full px-5 py-2 text-xs font-semibold"
          style={{ color: 'var(--color-synergy)' }}
        >
          <span className="inline-flex items-center gap-1">
            {t('nudge.openMode', {
              name: t(`modeContent.${suggestedModeSlug}.name`),
            })}
            <Icon name="arrow-right" size="sm" />
          </span>
        </Link>
      )}
    </div>
  )
}
