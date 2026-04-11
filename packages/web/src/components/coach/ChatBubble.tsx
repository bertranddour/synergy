interface ChatBubbleProps {
  sender: 'user' | 'alicia'
  content: string
  isStreaming?: boolean
  isTyping?: boolean
  suggestions?: Array<{ label: string; slug: string }>
}

export function ChatBubble({ sender, content, isStreaming, isTyping, suggestions }: ChatBubbleProps) {
  if (sender === 'alicia') {
    return (
      <div className="flex gap-3">
        {/* Alicia avatar */}
        <div
          className="shadow-neo-button mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--color-synergy)' }}
        >
          A
        </div>

        <div>
          {/* Message */}
          <div className="max-w-[80%] rounded-[1.2rem] rounded-tl-sm border-l-3 border-[var(--color-synergy)] bg-[var(--surface)] px-5 py-3 shadow-neo-well">
            {isTyping ? (
              <span className="flex gap-1.5 py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]" aria-live="polite">
                {content}
                {isStreaming && (
                  <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-[var(--color-synergy)]" />
                )}
              </p>
            )}
          </div>

          {/* Suggested action chips */}
          {suggestions && suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <a
                  key={s.slug}
                  href={`/modes/${s.slug}`}
                  className="neo-btn shadow-neo-button rounded-full px-4 py-1.5 text-xs font-semibold"
                  style={{ color: 'var(--color-synergy)' }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[1.2rem] rounded-tr-sm bg-[var(--surface)] px-5 py-3 shadow-neo-embossed">
        <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">{content}</p>
      </div>
    </div>
  )
}
