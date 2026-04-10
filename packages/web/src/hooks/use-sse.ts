import { useState, useCallback, useRef } from 'react'
import { useAuthStore } from '../stores/auth'

interface SSEEvent {
  type: 'text' | 'tool_call' | 'done' | 'error'
  content?: string
  name?: string
  conversationId?: string
  message?: string
}

interface UseAliciaStreamResult {
  text: string
  isStreaming: boolean
  error: string | null
  conversationId: string | null
  send: (params: {
    message: string
    surface: string
    conversationId?: string
    sessionId?: string
  }) => void
  reset: () => void
}

/**
 * SSE hook for streaming Alicia's responses.
 * Sends a POST to /api/coach/stream and reads SSE events.
 */
export function useAliciaStream(): UseAliciaStreamResult {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const token = useAuthStore((s) => s.token)

  const send = useCallback(async (params: {
    message: string
    surface: string
    conversationId?: string
    sessionId?: string
  }) => {
    // Abort previous stream if still active
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setText('')
    setIsStreaming(true)
    setError(null)

    try {
      const res = await fetch('/api/coach/stream', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE events from buffer
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6)
          if (!jsonStr) continue

          try {
            const event = JSON.parse(jsonStr) as SSEEvent

            switch (event.type) {
              case 'text':
                setText((prev) => prev + (event.content ?? ''))
                break
              case 'tool_call':
                // Could show a "thinking..." indicator
                break
              case 'done':
                setConversationId(event.conversationId ?? null)
                break
              case 'error':
                setError(event.message ?? 'Unknown error')
                break
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsStreaming(false)
    }
  }, [token])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setText('')
    setIsStreaming(false)
    setError(null)
    setConversationId(null)
  }, [])

  return { text, isStreaming, error, conversationId, send, reset }
}
