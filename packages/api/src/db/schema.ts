import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  stage: text('stage', {
    enum: ['solo', 'small-team', 'growing', 'scaling'],
  })
    .notNull()
    .default('solo'),
  teamSize: integer('team_size').notNull().default(1),
  onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).notNull().default(false),
  locale: text('locale').notNull().default('en'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// ─── Teams ───────────────────────────────────────────────────────────────────

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['mission', 'platform', 'leadership-circle'],
  }).notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const teamMembers = sqliteTable(
  'team_members',
  {
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role', {
      enum: ['lead', 'member'],
    })
      .notNull()
      .default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.teamId, table.userId] })],
)

// ─── Team Invitations ───────────────────────────────────────────────────────

export const teamInvitations = sqliteTable(
  'team_invitations',
  {
    id: text('id').primaryKey(),
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id),
    email: text('email').notNull(),
    role: text('role', { enum: ['lead', 'member'] })
      .notNull()
      .default('member'),
    invitedBy: text('invited_by')
      .notNull()
      .references(() => users.id),
    status: text('status', { enum: ['pending', 'accepted', 'revoked'] })
      .notNull()
      .default('pending'),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
  },
  (table) => [
    index('idx_invitations_team_status').on(table.teamId, table.status),
    index('idx_invitations_email_status').on(table.email, table.status),
  ],
)

// ─── Frameworks ──────────────────────────────────────────────────────────────

export const frameworks = sqliteTable('frameworks', {
  id: text('id').primaryKey(),
  slug: text('slug', {
    enum: ['core', 'air', 'max', 'synergy'],
  })
    .notNull()
    .unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  color: text('color').notNull(),
  modeCount: integer('mode_count').notNull(),
  translations: text('translations', { mode: 'json' }).$type<Record<string, FrameworkTranslation> | null>(),
})

export const userFrameworks = sqliteTable(
  'user_frameworks',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    frameworkId: text('framework_id')
      .notNull()
      .references(() => frameworks.id),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    activatedAt: integer('activated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.frameworkId] })],
)

// ─── Modes ───────────────────────────────────────────────────────────────────

export const modes = sqliteTable('modes', {
  id: text('id').primaryKey(),
  frameworkId: text('framework_id')
    .notNull()
    .references(() => frameworks.id),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  purpose: text('purpose').notNull(),
  trigger: text('trigger').notNull(),
  flowName: text('flow_name').notNull(),
  fieldsSchema: text('fields_schema', { mode: 'json' }).notNull().$type<FieldDefinitionJson[]>(),
  aiCoachPrompts: text('ai_coach_prompts', { mode: 'json' }).notNull().$type<CoachPromptJson[]>(),
  doneSignal: text('done_signal').notNull(),
  metricsSchema: text('metrics_schema', { mode: 'json' }).notNull().$type<MetricDefinitionJson[]>(),
  composabilityHooks: text('composability_hooks', { mode: 'json' }).notNull().$type<ComposabilityHookJson[]>(),
  timeEstimateMinutes: integer('time_estimate_minutes').notNull().default(15),
  sortOrder: integer('sort_order').notNull().default(0),
  translations: text('translations', { mode: 'json' }).$type<Record<string, ModeTranslation> | null>(),
})

// ─── Sessions ────────────────────────────────────────────────────────────────

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    teamId: text('team_id').references(() => teams.id),
    modeId: text('mode_id')
      .notNull()
      .references(() => modes.id),
    status: text('status', {
      enum: ['in_progress', 'completed', 'abandoned'],
    })
      .notNull()
      .default('in_progress'),
    fieldsData: text('fields_data', { mode: 'json' }).notNull().default('{}').$type<Record<string, unknown>>(),
    currentFieldIndex: integer('current_field_index').notNull().default(0),
    decision: text('decision', {
      enum: ['persevere', 'pivot', 'experiment-again'],
    }),
    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
  },
  (table) => [index('idx_sessions_user_status').on(table.userId, table.status, table.completedAt)],
)

// ─── Metrics ─────────────────────────────────────────────────────────────────

export const metrics = sqliteTable(
  'metrics',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    teamId: text('team_id').references(() => teams.id),
    sessionId: text('session_id').references(() => sessions.id),
    category: text('category', {
      enum: ['validation', 'operational', 'team', 'scaling', 'ai-collaboration'],
    }).notNull(),
    name: text('name').notNull(),
    value: integer('value', { mode: 'number' }).notNull(),
    unit: text('unit').notNull(),
    recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_metrics_user_category').on(table.userId, table.category, table.recordedAt),
    index('idx_metrics_user_name').on(table.userId, table.name, table.recordedAt),
  ],
)

// ─── Assessments ─────────────────────────────────────────────────────────────

export const assessments = sqliteTable(
  'assessments',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    frameworkId: text('framework_id')
      .notNull()
      .references(() => frameworks.id),
    status: text('status', {
      enum: ['in_progress', 'completed'],
    })
      .notNull()
      .default('in_progress'),
    responses: text('responses', { mode: 'json' }).notNull().default('[]').$type<AssessmentResponseJson[]>(),
    totalScore: integer('total_score'),
    maxScore: integer('max_score'),
    level: text('level', {
      enum: ['standing-still', 'crawling', 'walking', 'running', 'flying'],
    }),
    recommendations: text('recommendations', { mode: 'json' }).$type<string[]>(),
    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
  },
  (table) => [index('idx_assessments_user_framework').on(table.userId, table.frameworkId)],
)

// ─── Progress ────────────────────────────────────────────────────────────────

export const progress = sqliteTable('progress', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  completionRing: integer('completion_ring', { mode: 'number' }).notNull().default(0),
  consistencyStreak: integer('consistency_streak').notNull().default(0),
  growthScore: integer('growth_score', { mode: 'number' }).notNull().default(0),
  modesCompletedThisPeriod: integer('modes_completed_this_period').notNull().default(0),
  modesRecommendedThisPeriod: integer('modes_recommended_this_period').notNull().default(5),
  periodStart: integer('period_start', { mode: 'timestamp' }).notNull(),
  periodEnd: integer('period_end', { mode: 'timestamp' }).notNull(),
})

// ─── Coach Conversations ─────────────────────────────────────────────────────

export const coachConversations = sqliteTable('coach_conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  sessionId: text('session_id').references(() => sessions.id),
  messages: text('messages', { mode: 'json' }).notNull().default('[]').$type<CoachMessageJson[]>(),
  context: text('context', { mode: 'json' }).notNull().default('{}').$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// ─── Proactive Observations ──────────────────────────────────────────────────

export const proactiveObservations = sqliteTable(
  'proactive_observations',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    triggerType: text('trigger_type', {
      enum: ['stale-assumption', 'procrastination', 'health-decline', 'framework-readiness', 'missing-context'],
    }).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    suggestedModeSlug: text('suggested_mode_slug'),
    dismissed: integer('dismissed', { mode: 'boolean' }).notNull().default(false),
    actedOn: integer('acted_on', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [index('idx_observations_user_dismissed').on(table.userId, table.dismissed)],
)

// ─── Training Programs ───────────────────────────────────────────────────────

export const trainingPrograms = sqliteTable('training_programs', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  durationDays: integer('duration_days').notNull(),
  frameworksRequired: text('frameworks_required', { mode: 'json' }).notNull().$type<string[]>(),
  modeSequence: text('mode_sequence', { mode: 'json' }).notNull().$type<ModeSequenceJson[]>(),
  targetStage: text('target_stage', {
    enum: ['solo', 'small-team', 'growing', 'scaling'],
  }),
  translations: text('translations', { mode: 'json' }).$type<Record<string, ProgramTranslation> | null>(),
})

export const userPrograms = sqliteTable('user_programs', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  programId: text('program_id')
    .notNull()
    .references(() => trainingPrograms.id),
  status: text('status', {
    enum: ['active', 'completed', 'paused', 'abandoned'],
  })
    .notNull()
    .default('active'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  currentDay: integer('current_day').notNull().default(1),
  completedModes: text('completed_modes', { mode: 'json' }).notNull().default('[]').$type<string[]>(),
  metricsSnapshot: text('metrics_snapshot', { mode: 'json' }).$type<Record<string, number>>(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
})

// ─── Relations ───────────────────────────────────────────────────────────────

import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  teamMemberships: many(teamMembers),
  assessments: many(assessments),
  frameworks: many(userFrameworks),
}))

export const frameworksRelations = relations(frameworks, ({ many }) => ({
  modes: many(modes),
  userFrameworks: many(userFrameworks),
}))

export const modesRelations = relations(modes, ({ one }) => ({
  framework: one(frameworks, { fields: [modes.frameworkId], references: [frameworks.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  mode: one(modes, { fields: [sessions.modeId], references: [modes.id] }),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.ownerId], references: [users.id] }),
  members: many(teamMembers),
  invitations: many(teamInvitations),
}))

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, { fields: [teamInvitations.teamId], references: [teams.id] }),
  inviter: one(users, { fields: [teamInvitations.invitedBy], references: [users.id] }),
}))

// ─── JSON Type Helpers ───────────────────────────────────────────────────────

interface FieldDefinitionJson {
  name: string
  description: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'toggle' | 'structured'
  required: boolean
  options?: string[]
  example?: string
}

interface CoachPromptJson {
  fieldIndex: number
  prompt: string
}

interface MetricDefinitionJson {
  name: string
  unit: 'count' | 'percentage' | 'days' | 'hours' | 'score'
  extraction: string
}

interface ComposabilityHookJson {
  direction: 'feeds_into' | 'receives_from'
  modeSlug: string
  description: string
}

interface AssessmentResponseJson {
  scenarioId: string
  answer: 'a' | 'b' | 'c' | 'd'
  score: number
}

interface CoachMessageJson {
  role: 'user' | 'alicia'
  content: string
  timestamp: number
}

interface ModeSequenceJson {
  day: number
  modeSlug: string
  description: string
}

// ─── Translation Types ──────────────────────────────────────────────────────

export interface ModeTranslation {
  name: string
  purpose: string
  trigger: string
  flowName: string
  doneSignal: string
  fieldsSchema: FieldDefinitionJson[]
  composabilityHooks: ComposabilityHookJson[]
}

export interface FrameworkTranslation {
  name: string
  description: string
}

export interface ProgramTranslation {
  name: string
  description: string
  modeSequence: ModeSequenceJson[]
}
