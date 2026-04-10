import { describe, expect, it } from 'vitest'
import { coachMessageSchema, proactiveObservationSchema, sseEventSchema } from './coach'

describe('coach schemas', () => {
  describe('coachMessageSchema', () => {
    it('accepts valid message', () => {
      expect(coachMessageSchema.safeParse({ message: 'Hello', surface: 'chat' }).success).toBe(true)
    })

    it('accepts with optional fields', () => {
      expect(
        coachMessageSchema.safeParse({
          message: 'Hello',
          surface: 'mode-runner',
          conversationId: 'conv-1',
          sessionId: 'sess-1',
        }).success,
      ).toBe(true)
    })

    it('rejects empty message', () => {
      expect(coachMessageSchema.safeParse({ message: '', surface: 'chat' }).success).toBe(false)
    })

    it('rejects message over 10000 chars', () => {
      expect(coachMessageSchema.safeParse({ message: 'x'.repeat(10001), surface: 'chat' }).success).toBe(false)
    })

    it('accepts message at exactly 10000 chars', () => {
      expect(coachMessageSchema.safeParse({ message: 'x'.repeat(10000), surface: 'chat' }).success).toBe(true)
    })

    it('rejects invalid surface', () => {
      expect(coachMessageSchema.safeParse({ message: 'Hello', surface: 'invalid' }).success).toBe(false)
    })

    it('accepts all valid surfaces', () => {
      for (const surface of ['dashboard', 'mode-runner', 'chat', 'assessment', 'composability']) {
        expect(coachMessageSchema.safeParse({ message: 'Hi', surface }).success).toBe(true)
      }
    })
  })

  describe('sseEventSchema (discriminated union)', () => {
    it('accepts text event', () => {
      expect(sseEventSchema.safeParse({ type: 'text', content: 'Hello' }).success).toBe(true)
    })

    it('accepts tool_call event', () => {
      expect(sseEventSchema.safeParse({ type: 'tool_call', name: 'get_health_scores' }).success).toBe(true)
    })

    it('accepts done event', () => {
      expect(sseEventSchema.safeParse({ type: 'done', conversationId: 'conv-1' }).success).toBe(true)
    })

    it('accepts error event', () => {
      expect(sseEventSchema.safeParse({ type: 'error', message: 'Something failed' }).success).toBe(true)
    })

    it('rejects unknown event type', () => {
      expect(sseEventSchema.safeParse({ type: 'unknown' }).success).toBe(false)
    })
  })

  describe('proactiveObservationSchema', () => {
    it('accepts valid observation', () => {
      expect(
        proactiveObservationSchema.safeParse({
          id: 'obs-1',
          triggerType: 'stale-assumption',
          title: 'Test',
          message: 'Test message',
          suggestedModeSlug: 'validation',
          createdAt: '2026-04-10T00:00:00.000Z',
        }).success,
      ).toBe(true)
    })

    it('accepts null suggestedModeSlug', () => {
      expect(
        proactiveObservationSchema.safeParse({
          id: 'obs-1',
          triggerType: 'missing-context',
          title: 'Test',
          message: 'Test',
          suggestedModeSlug: null,
          createdAt: '2026-04-10T00:00:00.000Z',
        }).success,
      ).toBe(true)
    })

    it('rejects invalid trigger type', () => {
      expect(
        proactiveObservationSchema.safeParse({
          id: 'obs-1',
          triggerType: 'invalid',
          title: 'Test',
          message: 'Test',
          suggestedModeSlug: null,
          createdAt: '2026-04-10T00:00:00.000Z',
        }).success,
      ).toBe(false)
    })
  })
})
