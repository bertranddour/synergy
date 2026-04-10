import { describe, expect, it } from 'vitest'
import { signToken, verifyToken } from './crypto'

describe('crypto', () => {
  const SECRET = 'test-secret-key-for-testing'

  describe('signToken / verifyToken', () => {
    it('signs and verifies a token', async () => {
      const payload = JSON.stringify({ email: 'test@example.com', ts: Date.now() })
      const token = await signToken(payload, SECRET)

      expect(token).toBeTruthy()
      expect(token).toContain('.')

      const verified = await verifyToken(token, SECRET)
      expect(verified).toBe(payload)
    })

    it('rejects a token with wrong secret', async () => {
      const payload = 'test-payload'
      const token = await signToken(payload, SECRET)

      const verified = await verifyToken(token, 'wrong-secret')
      expect(verified).toBeNull()
    })

    it('rejects a tampered token', async () => {
      const payload = 'test-payload'
      const token = await signToken(payload, SECRET)

      const tampered = `${token.slice(0, -1)}x`
      const verified = await verifyToken(tampered, SECRET)
      expect(verified).toBeNull()
    })

    it('rejects a malformed token', async () => {
      expect(await verifyToken('no-dot', SECRET)).toBeNull()
      expect(await verifyToken('', SECRET)).toBeNull()
    })

    it('handles special characters in payload', async () => {
      const payload = JSON.stringify({ msg: 'Hello "world" & <friends>' })
      const token = await signToken(payload, SECRET)
      const verified = await verifyToken(token, SECRET)
      expect(verified).toBe(payload)
    })
  })
})
