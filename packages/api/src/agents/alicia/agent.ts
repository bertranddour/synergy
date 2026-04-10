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
 * Manages per-user coaching state with SQLite persistence.
 * Handles conversation history, context snapshots, and scheduled proactive checks.
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

    // Initialize SQLite tables
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

    // Load state from storage on construction
    this.ctx.blockConcurrencyWhile(async () => {
      const stored = await this.ctx.storage.get<AliciaState>('state')
      if (stored) {
        this.state = stored
      }
    })
  }

  /** Initialize for a specific user */
  async init(userId: string): Promise<void> {
    this.state.userId = userId
    await this.persist()
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
    this.state.messages.push({
      role: 'user',
      content,
      timestamp: Date.now(),
    })
    await this.persist()
  }

  /** Add an assistant (Alicia) message to the conversation */
  async addAssistantMessage(content: string): Promise<void> {
    this.state.messages.push({
      role: 'assistant',
      content,
      timestamp: Date.now(),
    })
    await this.persist()
  }

  /** Update context snapshot */
  async updateContext(context: Record<string, unknown>): Promise<void> {
    this.state.contextSnapshot = { ...this.state.contextSnapshot, ...context }
    await this.persist()
  }

  /** Get conversation count for context management */
  getMessageCount(): number {
    return this.state.messages.length
  }

  /** Trim old messages if conversation is getting long (basic context management) */
  async trimIfNeeded(maxMessages = 40): Promise<void> {
    if (this.state.messages.length > maxMessages) {
      // Keep the last N messages
      this.state.messages = this.state.messages.slice(-maxMessages)
      await this.persist()
    }
  }

  /** Save a conversation to SQLite for long-term storage */
  async saveConversation(conversationId: string, userId: string): Promise<void> {
    const now = Date.now()
    this.ctx.storage.sql.exec(
      `INSERT OR REPLACE INTO conversations (id, user_id, messages, context, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      conversationId,
      userId,
      JSON.stringify(this.state.messages),
      JSON.stringify(this.state.contextSnapshot),
      now,
      now,
    )
  }

  /** Load a conversation from SQLite */
  async loadConversation(conversationId: string): Promise<boolean> {
    const cursor = this.ctx.storage.sql.exec(`SELECT messages, context FROM conversations WHERE id = ?`, conversationId)
    const rows = cursor.toArray()
    if (rows.length === 0) return false

    const row = rows[0]!
    this.state.messages = JSON.parse(row.messages as string) as ConversationMessage[]
    this.state.contextSnapshot = JSON.parse(row.context as string) as Record<string, unknown>
    this.state.conversationId = conversationId
    await this.persist()
    return true
  }

  /** Reset conversation state */
  async reset(): Promise<void> {
    this.state.messages = []
    this.state.contextSnapshot = {}
    this.state.conversationId = null
    await this.persist()
  }

  /** Handle HTTP requests to this Durable Object */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/init' && request.method === 'POST') {
      const body = (await request.json()) as { userId: string }
      await this.init(body.userId)
      return Response.json({ ok: true })
    }

    if (url.pathname === '/history') {
      return Response.json({
        messages: this.getConversationHistory(),
        count: this.getMessageCount(),
      })
    }

    if (url.pathname === '/reset' && request.method === 'POST') {
      await this.reset()
      return Response.json({ ok: true })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  private async persist(): Promise<void> {
    await this.ctx.storage.put('state', this.state)
  }
}
