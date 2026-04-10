import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  stage: z.enum(['solo', 'small-team', 'growing', 'scaling']),
  teamSize: z.number().int().positive(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  stage: z.enum(['solo', 'small-team', 'growing', 'scaling']).optional(),
  teamSize: z.number().int().positive().optional(),
  onboardingCompleted: z.boolean().optional(),
})

export const userWithFrameworksSchema = z.object({
  user: userSchema,
  frameworks: z.array(z.object({
    slug: z.enum(['core', 'air', 'max', 'synergy']),
    name: z.string(),
    active: z.boolean(),
    activatedAt: z.string().datetime().nullable(),
  })),
})

export const activateFrameworkSchema = z.object({
  frameworkSlug: z.enum(['core', 'air', 'max', 'synergy']),
})

export type User = z.infer<typeof userSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type UserWithFrameworks = z.infer<typeof userWithFrameworksSchema>
