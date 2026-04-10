/** Generate an HMAC-SHA256 signed token */
export async function signToken(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const data = encoder.encode(payload)
  const signature = await crypto.subtle.sign('HMAC', key, data)
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}.${sigB64}`
}

/** Verify an HMAC-SHA256 signed token and return the payload */
export async function verifyToken(token: string, secret: string): Promise<string | null> {
  const [payloadB64, sigB64] = token.split('.')
  if (!payloadB64 || !sigB64) return null

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  const payload = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
  const data = encoder.encode(payload)
  const signature = Uint8Array.from(
    atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0),
  )

  const valid = await crypto.subtle.verify('HMAC', key, signature, data)
  if (!valid) return null

  return payload
}
