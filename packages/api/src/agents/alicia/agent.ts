import { DurableObject } from 'cloudflare:workers'
import type { Env } from '../../env.js'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AliciaState {
  userId: string | null
  conversationId: string | null
  messages: ConversationMessage[]
  contextSnapshot: Record<string, unknown>
}

/**
 * AliciaAgent Durable Object.
 * Manages per-user coaching state with SQLite-only persistence.
 * All state stored via this.ctx.storage.sql — no KV mixed storage.
 */
export class AliciaAgent extends DurableObject<Env> {
  private state: AliciaState = {
    userId: null,
    conversationId: null,
    messages: [],
    contextSnapshot: {},
  }

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)

    // All initialization inside blockConcurrencyWhile per CF best practices
    this.ctx.blockConcurrencyWhile(async () => {
      // Create tables
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          messages TEXT NOT NULL DEFAULT '[]',
          context TEXT NOT NULL DEFAULT '{}',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `)

      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS agent_state (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `)

      // Load state from SQLite
      const cursor = this.ctx.storage.sql.exec("SELECT value FROM agent_state WHERE key = 'main'")
      const rows = cursor.toArray()
      if (rows.length > 0) {
        const stored = JSON.parse(rows[0]!.value as string) as AliciaState
        this.state = stored
      }
    })
  }

  /** Initialize for a specific user */
  async init(userId: string): Promise<void> {
    this.state.userId = userId
    this.persist()
  }

  /** Get conversation history for building Anthropic messages */
  getConversationHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.state.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  }

  /** Add a user message to the conversation */
  async addUserMessage(content: string): Promise<void> {
    this.state.messages.push({ role: 'user', content, timestamp: Date.now() })
    this.persist()
  }

  /** Add an assistant (Alicia) message to the conversation */
  async addAssistantMessage(content: string): Promise<void> {
    this.state.messages.push({ role: 'assistant', content, timestamp: Date.now() })
    this.persist()
  }

  /** Update context snapshot */
  async updateContext(context: Record<string, unknown>): Promise<void> {
    this.state.contextSnapshot = { ...this.state.contextSnapshot, ...context }
    this.persist()
  }

  /** Get conversation count for context management */
  getMessageCount(): number {
    return this.state.messages.length
  }

  /** Trim old messages if conversation is getting long */
  async trimIfNeeded(maxMessages = 40): Promise<void> {
    if (this.state.messages.length > maxMessages) {
      this.state.messages = this.state.messages.slice(-maxMessages)
      this.persist()
    }
  }

  /** Save a conversation to SQLite for long-term storage */
  saveConversation(conversationId: string, userId: string): void {
    const now = Date.now()
    this.ctx.storage.sql.exec(
      'INSERT OR REPLACE INTO conversations (id, user_id, messages, context, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      conversationId,
      userId,
      JSON.stringify(this.state.messages),
      JSON.stringify(this.state.contextSnapshot),
      now,
      now,
    )
  }

  /** Load a conversation from SQLite */
  loadConversation(conversationId: string): boolean {
    const cursor = this.ctx.storage.sql.exec('SELECT messages, context FROM conversations WHERE id = ?', conversationId)
    const rows = cursor.toArray()
    if (rows.length === 0) return false

    const row = rows[0]!
    this.state.messages = JSON.parse(row.messages as string) as ConversationMessage[]
    this.state.contextSnapshot = JSON.parse(row.context as string) as Record<string, unknown>
    this.state.conversationId = conversationId
    this.persist()
    return true
  }

  /** Reset conversation state */
  async reset(): Promise<void> {
    this.state.messages = []
    this.state.contextSnapshot = {}
    this.state.conversationId = null
    this.persist()
  }

  // All public methods are exposed as RPC endpoints automatically.
  // Per CF docs: "Projects with a compatibility date of 2024-04-03 or later should use RPC methods."
  // No fetch() handler needed — callers use stub.methodName() directly with full type safety.

  /** Persist state to SQLite (no KV) */
  private persist(): void {
    this.ctx.storage.sql.exec(
      "INSERT OR REPLACE INTO agent_state (key, value) VALUES ('main', ?)",
      JSON.stringify(this.state),
    )
  }
}
