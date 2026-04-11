import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatBubble } from '../../../components/coach/ChatBubble'
import { useAliciaStream } from '../../../hooks/use-sse'
import { useAuthStore } from '../../../stores/auth'
import { useLocaleStore } from '../../../stores/locale'

export const Route = createFileRoute('/_auth/coach/')({
  component: CoachChat,
})

interface ChatMessage {
  id: string
  role: 'user' | 'alicia'
  content: string
}

interface ConversationPreview {
  id: string
  preview: string
  messageCount: number
  updatedAt: string
}

function CoachChat() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)
  const locale = useLocaleStore((s) => s.locale)
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { text, isStreaming, error, conversationId, suggestions, send, reset } = useAliciaStream()

  // Fetch conversation list
  const conversationsQuery = useQuery({
    queryKey: ['coach-conversations'],
    queryFn: async () => {
      const res = await fetch('/api/coach/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{ conversations: ConversationPreview[] }>
    },
  })

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 || text) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, text])

  // When streaming completes, add Alicia's message to history and refresh conversations
  useEffect(() => {
    if (!isStreaming && text) {
      setMessages((prev) => [...prev, { id: `alicia-${Date.now()}`, role: 'alicia', content: text }])
      if (conversationId) {
        setActiveConversationId(conversationId)
      }
      void queryClient.invalidateQueries({ queryKey: ['coach-conversations'] })
    }
  }, [isStreaming, text, conversationId, queryClient])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: userMessage }])

    send({
      message: userMessage,
      surface: 'chat',
      conversationId: activeConversationId ?? undefined,
      locale,
    })
  }

  const loadConversation = async (convId: string) => {
    try {
      const res = await fetch(`/api/coach/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load')
      const data = (await res.json()) as {
        id: string
        messages: Array<{ role: string; content: string }>
      }

      setActiveConversationId(data.id)
      reset()
      setMessages(
        data.messages.map((m, i) => ({
          id: `${m.role}-${i}`,
          role: m.role === 'assistant' ? ('alicia' as const) : ('user' as const),
          content: m.content,
        })),
      )
    } catch {
      // Silently fail — keep current state
    }
  }

  const startNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
    reset()
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="wave-entrance-1 mb-4">
        <h1 className="font-display text-2xl tracking-tight">{t('coach.title')}</h1>
        <p className="text-sm text-[var(--text-tertiary)]">{t('coach.subtitle')}</p>
      </div>

      {/* Conversation tabs */}
      {conversationsQuery.data && conversationsQuery.data.conversations.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={startNewChat}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              !activeConversationId
                ? 'shadow-neo-embossed text-[var(--text-primary)]'
                : 'shadow-neo-button text-[var(--text-tertiary)]'
            }`}
          >
            {t('coach.newChat')}
          </button>
          {conversationsQuery.data.conversations.slice(0, 8).map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => void loadConversation(conv.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs transition-all ${
                activeConversationId === conv.id
                  ? 'shadow-neo-embossed font-semibold text-[var(--text-primary)]'
                  : 'shadow-neo-button text-[var(--text-tertiary)]'
              }`}
            >
              {conv.preview.length > 30 ? `${conv.preview.slice(0, 30)}...` : conv.preview}
            </button>
          ))}
        </div>
      )}

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
              <p className="mt-4 font-display text-xl">{t('coach.greeting')}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('coach.greetingSub')}</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            sender={msg.role}
            content={msg.content}
            suggestions={msg.role === 'alicia' && i === messages.length - 1 && !isStreaming ? suggestions : undefined}
          />
        ))}

        {/* Typing indicator */}
        {isStreaming && !text && <ChatBubble sender="alicia" content="" isTyping />}

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
          placeholder={t('coach.placeholder')}
          disabled={isStreaming}
          className="input-embossed flex-1 px-6 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="neo-btn shadow-neo-button rounded-full px-8 py-3 font-semibold transition-opacity disabled:opacity-40"
          style={{ color: 'var(--color-synergy)' }}
        >
          {isStreaming ? '...' : t('common.send')}
        </button>
      </form>
    </div>
  )
}
