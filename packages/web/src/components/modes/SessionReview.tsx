interface SessionReviewProps {
  fieldsSchema: Array<{
    name: string
    description: string
    type: string
  }>
  fieldsData: Record<string, unknown>
}

export function SessionReview({ fieldsSchema, fieldsData }: SessionReviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Your Responses</h2>
      {fieldsSchema.map((field, i) => {
        const value = fieldsData[String(i)]
        return (
          <div
            key={field.name}
            className={`wave-entrance-${Math.min(i + 1, 5)} shadow-neo-well rounded-[1.5rem] bg-[var(--surface)] p-5`}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold shadow-neo-button">
                {i + 1}
              </span>
              <span className="font-semibold">{field.name}</span>
              <span className="text-xs text-[var(--text-tertiary)]">({field.type})</span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">{field.description}</p>
            <div className="shadow-neo-inset mt-3 rounded-xl p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
                {value !== undefined && value !== null ? String(value) : '—'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
