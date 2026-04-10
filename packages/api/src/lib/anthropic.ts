import Anthropic from '@anthropic-ai/sdk'
import type { Env } from '../env.js'

/**
 * Create an Anthropic client configured for Cloudflare AI Gateway with BYOK.
 *
 * The Anthropic API key is stored in the AI Gateway dashboard (Provider Keys).
 * The Worker only needs the gateway token for authentication.
 * This is more secure — the actual API key never travels through Worker code.
 *
 * Setup:
 * 1. Go to Cloudflare Dashboard → AI → AI Gateway → Provider Keys
 * 2. Add your Anthropic API key
 * 3. Set AI_GATEWAY_TOKEN as a Worker secret
 */
export function createAnthropicClient(env: Env): Anthropic {
  return new Anthropic({
    apiKey: '', // Gateway handles auth via BYOK — empty string required by SDK
    baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic`,
    defaultHeaders: {
      'cf-aig-authorization': `Bearer ${env.AI_GATEWAY_TOKEN}`,
    },
  })
}
