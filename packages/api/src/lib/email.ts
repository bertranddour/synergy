import { Resend } from 'resend'
import type { Env } from '../env.js'

/**
 * Send a magic link email via Resend.
 * Sender: noreply@7flows.com (verified domain on Resend).
 */
export async function sendMagicLinkEmail(env: Env, to: string, magicLinkUrl: string): Promise<void> {
  const resend = new Resend(env.RESEND_API_KEY)

  await resend.emails.send({
    from: '7 Flows Synergy <noreply@7flows.com>',
    to,
    subject: 'Your magic link to sign in',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">7 Flows Synergy</h1>
        <p style="font-size: 14px; color: #666; margin: 0 0 32px;">Your business fitness system</p>

        <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 24px;">
          Click the button below to sign in. This link expires in 15 minutes.
        </p>

        <a href="${magicLinkUrl}"
           style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 14px; font-weight: 600;">
          Sign in to Synergy
        </a>

        <p style="font-size: 12px; color: #999; margin: 32px 0 0; line-height: 1.5;">
          If you didn't request this email, you can safely ignore it.<br>
          This link will expire in 15 minutes.
        </p>

        <p style="font-size: 11px; color: #ccc; margin: 24px 0 0;">
          <a href="${magicLinkUrl}" style="color: #999; word-break: break-all;">${magicLinkUrl}</a>
        </p>
      </div>
    `,
  })
}
