/**
 * Build mode-specific coaching context for the Mode Runner surface.
 */
export function buildModeCoachPrompt(params: {
  modeName: string
  fieldName: string
  fieldIndex: number
  fieldDescription: string
  userResponse: string
  aiCoachPrompts: Array<{ fieldIndex: number; prompt: string }>
  doneSignal: string
  totalFields: number
}): string {
  const { modeName, fieldName, fieldIndex, fieldDescription, userResponse, aiCoachPrompts, doneSignal, totalFields } =
    params

  const coachPrompt = aiCoachPrompts.find((p) => p.fieldIndex === fieldIndex)

  return `## Mode Runner Context

You are coaching inside ${modeName}.
Current field: ${fieldName} (field ${fieldIndex + 1} of ${totalFields})
Field description: ${fieldDescription}

The user just submitted this response:
"${userResponse}"

${coachPrompt ? `AI Coach Prompt for this field: ${coachPrompt.prompt}` : 'No specific coaching prompt for this field. Use your judgment to challenge or encourage.'}

Done Signal for this mode: "${doneSignal}"

## Your Task

Challenge the user's response using the question-challenge-suggest pattern:
1. Acknowledge what they wrote (briefly).
2. Challenge weak thinking, vague answers, or missing specifics.
3. Suggest a concrete improvement or next action.

Keep it to 2-4 sentences. Be direct. Be Alicia.
If the answer is genuinely strong, say so — but raise the bar for next time.`
}
