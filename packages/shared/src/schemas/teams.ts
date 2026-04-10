import { z } from 'zod'

export const createTeamSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['mission', 'platform', 'leadership-circle']),
})

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['mission', 'platform', 'leadership-circle']),
  ownerId: z.string(),
  createdAt: z.string().datetime(),
})

export const teamMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['lead', 'member']),
  joinedAt: z.string().datetime(),
})

export const teamWithMembersSchema = z.object({
  team: teamSchema,
  members: z.array(teamMemberSchema),
})

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['lead', 'member']).default('member'),
})

export const teamHealthSchema = z.object({
  teamHealth: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
    trend: z.enum(['improving', 'stable', 'declining']),
  })),
  memberProgress: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    completion: z.number().min(0).max(100),
    consistency: z.number().int().min(0),
    growth: z.number().min(0).max(100),
  })),
  teamMetrics: z.array(z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
  })),
})

export type Team = z.infer<typeof teamSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamWithMembers = z.infer<typeof teamWithMembersSchema>
export type CreateTeam = z.infer<typeof createTeamSchema>
export type TeamHealth = z.infer<typeof teamHealthSchema>
