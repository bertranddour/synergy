import { describe, expect, it } from 'vitest'
import { buildModeCoachPrompt } from './mode-coach'

describe('mode coach prompt builder', () => {
  const baseParams = {
    modeName: 'Validation Mode',
    fieldName: 'Assumption',
    fieldIndex: 0,
    fieldDescription: 'The specific belief you are testing.',
    userResponse: 'Freelance designers will pay $49/month.',
    aiCoachPrompts: [
      { fieldIndex: 0, prompt: 'Is this assumption specific enough to disprove?' },
      { fieldIndex: 3, prompt: 'What is the cheapest version of this test?' },
    ],
    doneSignal: 'Can you state your assumption and decision in one sentence?',
    totalFields: 10,
  }

  it('includes mode name', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('Validation Mode')
  })

  it('includes field name and index', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('Assumption')
    expect(prompt).toContain('field 1 of 10')
  })

  it('includes user response', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('Freelance designers will pay $49/month.')
  })

  it('includes matching AI coach prompt', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('Is this assumption specific enough to disprove?')
  })

  it('handles field without specific coach prompt', () => {
    const prompt = buildModeCoachPrompt({ ...baseParams, fieldIndex: 5 })
    expect(prompt).toContain('Use your judgment')
  })

  it('includes done signal', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('Can you state your assumption')
  })

  it('includes question-challenge-suggest instruction', () => {
    const prompt = buildModeCoachPrompt(baseParams)
    expect(prompt).toContain('question-challenge-suggest')
  })
})
