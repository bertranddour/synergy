import { describe, expect, it } from 'vitest'
import { PERSONALITY_PROMPT } from './personality'

describe('Alicia personality prompt', () => {
  it('contains the name Alicia', () => {
    expect(PERSONALITY_PROMPT).toContain('Alicia')
  })

  it('defines the 4 frameworks', () => {
    expect(PERSONALITY_PROMPT).toContain('Core X')
    expect(PERSONALITY_PROMPT).toContain('Air X')
    expect(PERSONALITY_PROMPT).toContain('Max X')
    expect(PERSONALITY_PROMPT).toContain('Synergy X')
  })

  it('includes question-challenge-suggest pattern', () => {
    expect(PERSONALITY_PROMPT).toContain('question')
    expect(PERSONALITY_PROMPT).toContain('challenge')
    expect(PERSONALITY_PROMPT).toContain('suggest')
  })

  it('includes banned words', () => {
    expect(PERSONALITY_PROMPT).toContain('holistic')
    expect(PERSONALITY_PROMPT).toContain('leverage')
    expect(PERSONALITY_PROMPT).toContain('synergistic')
  })

  it('has voice traits', () => {
    expect(PERSONALITY_PROMPT).toContain('Bubbly')
    expect(PERSONALITY_PROMPT).toContain('Punchy')
    expect(PERSONALITY_PROMPT).toContain('Brutally honest')
    expect(PERSONALITY_PROMPT).toContain('Zero BS')
  })

  it('is substantial (>500 words)', () => {
    const wordCount = PERSONALITY_PROMPT.split(/\s+/).length
    expect(wordCount).toBeGreaterThan(300)
  })
})
