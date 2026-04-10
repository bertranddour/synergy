import Anthropic from '@anthropic-ai/sdk'
import type { Env } from '../env.js'

/**
 * Create an Anthropic client configured for Cloudflare AI Gateway with BYOK.
 *
 * The Anthropic API key is stored in the AI Gateway dashboard (Provider Keys).
 * The AI_GATEWAY_TOKEN authenticates to the gateway, which injects the real key.
 */
export function createAnthropicClient(env: Env): Anthropic {
  return new Anthropic({
    apiKey: env.AI_GATEWAY_TOKEN,
    baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic`,
  })
}
