import { describe, expect, it } from 'vitest'
import { getSurfacePrompt } from './surfaces'

describe('surface prompts', () => {
  const surfaces = ['dashboard', 'mode-runner', 'chat', 'assessment', 'composability'] as const

  for (const surface of surfaces) {
    it(`returns a non-empty prompt for ${surface}`, () => {
      const prompt = getSurfacePrompt(surface)
      expect(prompt).toBeTruthy()
      expect(prompt.length).toBeGreaterThan(50)
    })
  }

  it('dashboard prompt mentions proactive observation', () => {
    expect(getSurfacePrompt('dashboard')).toContain('proactive')
  })

  it('mode-runner prompt mentions coaching', () => {
    expect(getSurfacePrompt('mode-runner')).toContain('coaching')
  })

  it('chat prompt mentions open coaching', () => {
    expect(getSurfacePrompt('chat')).toContain('coaching')
  })

  it('assessment prompt mentions debrief', () => {
    expect(getSurfacePrompt('assessment')).toContain('debrief')
  })

  it('composability prompt mentions next mode', () => {
    expect(getSurfacePrompt('composability')).toContain('next')
  })
})
