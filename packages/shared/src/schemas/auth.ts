import { z } from 'zod'

export const magicLinkRequestSchema = z.object({
  email: z.string().email(),
})

export const magicLinkResponseSchema = z.object({
  sent: z.literal(true),
})

export const verifyTokenQuerySchema = z.object({
  token: z.string().min(1),
})

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
    stage: z.enum(['solo', 'small-team', 'growing', 'scaling']),
    teamSize: z.number().int().positive(),
    onboardingCompleted: z.boolean(),
  }),
})

export const oauthCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
})

export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
