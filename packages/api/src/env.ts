/** Cloudflare Worker environment bindings */
export interface Env {
  // D1 Database
  DB: D1Database

  // KV Namespace
  KV: KVNamespace

  // R2 Bucket
  R2: R2Bucket

  // Queue
  QUEUE: Queue

  // Durable Objects
  ALICIA: DurableObjectNamespace

  // Workers AI
  AI: Ai

  // Secrets
  JWT_SECRET: string
  MAGIC_LINK_SECRET: string
  AI_GATEWAY_TOKEN: string

  // AI Gateway (BYOK — Anthropic key stored on gateway dashboard)
  CF_ACCOUNT_ID: string
  AI_GATEWAY_ID: string

  // Vars
  ENVIRONMENT: string
}
