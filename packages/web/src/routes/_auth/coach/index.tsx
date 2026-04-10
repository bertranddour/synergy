import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ChatBubble } from '../../../components/coach/ChatBubble'
import { useAliciaStream } from '../../../hooks/use-sse'

export const Route = createFileRoute('/_auth/coach/')({
  component: CoachChat,
})

interface ChatMessage {
  id: string
  role: 'user' | 'alicia'
  content: string
}

function CoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { text, isStreaming, error, conversationId, send } = useAliciaStream()

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  // When streaming completes, add Alicia's message to history
  useEffect(() => {
    if (!isStreaming && text) {
      setMessages((prev) => [...prev, { id: `alicia-${Date.now()}`, role: 'alicia', content: text }])
    }
  }, [isStreaming, text])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to history
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: userMessage }])

    // Stream Alicia's response
    send({
      message: userMessage,
      surface: 'chat',
      conversationId: conversationId ?? undefined,
    })
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="wave-entrance-1 mb-4">
        <h1 className="font-display text-2xl tracking-tight">Talk to Alicia</h1>
        <p className="text-sm text-[var(--text-tertiary)]">Your business coaching colleague</p>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex-1 space-y-4 overflow-y-auto rounded-[2rem] bg-[var(--surface)] p-6 shadow-neo-inset"
      >
        {messages.length === 0 && !isStreaming && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div
                className="shadow-neo-panel mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: 'var(--color-synergy)' }}
              >
                A
              </div>
              <p className="mt-4 font-display text-xl">Hey! What are we working on?</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                I know your business. Ask me anything — strategy, validation, team, scaling, AI collaboration.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.role} content={msg.content} />
        ))}

        {/* Streaming response */}
        {isStreaming && text && <ChatBubble sender="alicia" content={text} isStreaming />}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Alicia anything..."
          disabled={isStreaming}
          className="input-embossed flex-1 px-6 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="neo-btn shadow-neo-button rounded-full px-8 py-3 font-semibold transition-opacity disabled:opacity-40"
          style={{ color: 'var(--color-synergy)' }}
        >
          {isStreaming ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
