import Anthropic from '@anthropic-ai/sdk'
import type { Env } from '../env.js'

/**
 * Create an Anthropic client configured for Cloudflare AI Gateway with BYOK.
 *
 * The Anthropic API key is stored in the AI Gateway dashboard (Provider Keys).
 * The gateway token authenticates the Worker to the gateway.
 * The gateway replaces the Authorization header with the real Anthropic key.
 *
 * Setup:
 * 1. Go to Cloudflare Dashboard → AI → AI Gateway → Provider Keys
 * 2. Add your Anthropic API key
 * 3. Set AI_GATEWAY_TOKEN as a Worker secret
 */
export function createAnthropicClient(env: Env): Anthropic {
  return new Anthropic({
    // The gateway token satisfies the SDK's auth requirement.
    // AI Gateway intercepts the request and replaces with the real Anthropic key via BYOK.
    apiKey: env.AI_GATEWAY_TOKEN,
    baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic`,
    defaultHeaders: {
      'cf-aig-authorization': `Bearer ${env.AI_GATEWAY_TOKEN}`,
    },
  })
}
