interface ChatBubbleProps {
  sender: 'user' | 'alicia'
  content: string
  isStreaming?: boolean
}

export function ChatBubble({ sender, content, isStreaming }: ChatBubbleProps) {
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

        {/* Message */}
        <div className="max-w-[80%] rounded-[1.2rem] rounded-tl-sm border-l-3 border-[var(--color-synergy)] bg-[var(--surface)] px-5 py-3 shadow-neo-well">
          <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">
            {content}
            {isStreaming && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-[var(--color-synergy)]" />}
          </p>
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
