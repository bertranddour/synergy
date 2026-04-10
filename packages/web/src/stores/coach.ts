import { create } from 'zustand'

interface ChatMessage {
  id: string
  role: 'user' | 'alicia'
  content: string
  timestamp: number
}

interface CoachState {
  messages: ChatMessage[]
  conversationId: string | null
  isStreaming: boolean
  streamingText: string

  addMessage: (msg: ChatMessage) => void
  setConversationId: (id: string | null) => void
  setStreaming: (streaming: boolean) => void
  setStreamingText: (text: string) => void
  appendStreamingText: (chunk: string) => void
  clearMessages: () => void
}

export const useCoachStore = create<CoachState>((set) => ({
  messages: [],
  conversationId: null,
  isStreaming: false,
  streamingText: '',

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setConversationId: (id) => set({ conversationId: id }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setStreamingText: (text) => set({ streamingText: text }),
  appendStreamingText: (chunk) => set((state) => ({ streamingText: state.streamingText + chunk })),
  clearMessages: () => set({ messages: [], conversationId: null, streamingText: '' }),
}))
