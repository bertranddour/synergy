import type Anthropic from '@anthropic-ai/sdk'
import type { Database } from '../../lib/db.js'
import { ALICIA_TOOLS, executeTool } from './tools/index.js'

interface AliciaLoopParams {
  anthropic: Anthropic
  db: Database
  userId: string
  systemPrompt: string
  messages: Anthropic.Messages.MessageParam[]
  onTextChunk: (text: string) => void
  onToolCall?: (name: string) => void
  maxTurns?: number
}

interface AliciaLoopResult {
  fullResponse: string
  toolsUsed: string[]
  messages: Anthropic.Messages.MessageParam[]
}

/**
 * Custom agent loop for Alicia.
 * Handles multi-step reasoning: Claude calls tools, we execute them,
 * feed results back, and continue until Claude produces a final text response.
 */
export async function runAliciaLoop(params: AliciaLoopParams): Promise<AliciaLoopResult> {
  const { anthropic, db, userId, systemPrompt, messages, onTextChunk, onToolCall, maxTurns = 5 } = params

  const conversationMessages = [...messages]
  let fullResponse = ''
  const toolsUsed: string[] = []

  for (let turn = 0; turn < maxTurns; turn++) {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      thinking: { type: 'enabled', budget_tokens: 8000 },
      system: systemPrompt,
      tools: ALICIA_TOOLS,
      messages: conversationMessages,
    })

    // Collect the streamed response
    let turnText = ''
    const toolUseBlocks: Anthropic.Messages.ToolUseBlock[] = []

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          turnText += event.delta.text
          onTextChunk(event.delta.text)
        }
      }
    }

    const finalMessage = await stream.finalMessage()

    // Collect tool use blocks from the final message
    for (const block of finalMessage.content) {
      if (block.type === 'tool_use') {
        toolUseBlocks.push(block)
      }
    }

    // If no tool calls, we're done
    if (toolUseBlocks.length === 0) {
      fullResponse += turnText
      // Add assistant message to conversation
      conversationMessages.push({
        role: 'assistant',
        content: finalMessage.content,
      })
      break
    }

    // Execute tool calls
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = []

    for (const toolUse of toolUseBlocks) {
      onToolCall?.(toolUse.name)
      toolsUsed.push(toolUse.name)

      const result = await executeTool(db, userId, toolUse.name, toolUse.input as Record<string, unknown>)

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: result,
      })
    }

    // Add assistant message and tool results to conversation
    conversationMessages.push({
      role: 'assistant',
      content: finalMessage.content,
    })
    conversationMessages.push({
      role: 'user',
      content: toolResults,
    })

    fullResponse += turnText
  }

  return {
    fullResponse,
    toolsUsed,
    messages: conversationMessages,
  }
}
