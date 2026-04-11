/** Framework accent colors */
export const FRAMEWORK_COLORS = {
  core: '#3B82F6',
  air: '#14B8A6',
  max: '#8B5CF6',
  synergy: '#F59E0B',
} as const

/** Framework display names */
export const FRAMEWORK_NAMES = {
  core: 'Core X',
  air: 'Air X',
  max: 'Max X',
  synergy: 'Synergy X',
} as const

/** Framework descriptions for assessments and onboarding */
export const FRAMEWORK_DESCRIPTIONS = {
  core: 'Validation-driven business building. Test assumptions, capture insights, build propositions.',
  air: 'Async-first flex work. Information flow, team rhythms, remote culture.',
  max: 'Scaling without bureaucracy. Org structure, cross-team alignment, quality at scale.',
  synergy: 'Human-AI collaboration. Onboarding AI colleagues, trust calibration, decision protocols.',
} as const

/** Health score color thresholds */
export const HEALTH_COLORS = {
  green: { min: 70, color: '#22C55E' },
  yellow: { min: 40, color: '#EAB308' },
  orange: { min: 20, color: '#F97316' },
  red: { min: 0, color: '#EF4444' },
} as const

/** Health categories */
export const HEALTH_CATEGORIES = ['validation', 'operational', 'team', 'scaling', 'ai-collaboration'] as const

/** Framework slugs */
export type FrameworkSlug = keyof typeof FRAMEWORK_COLORS
export const FRAMEWORK_SLUGS = Object.keys(FRAMEWORK_COLORS) as FrameworkSlug[]

/** User stages */
export const USER_STAGES = ['solo', 'small-team', 'growing', 'scaling'] as const
export type UserStage = (typeof USER_STAGES)[number]

/** Session statuses */
export const SESSION_STATUSES = ['in_progress', 'completed', 'abandoned'] as const
export type SessionStatus = (typeof SESSION_STATUSES)[number]

/** Session decisions */
export const SESSION_DECISIONS = ['persevere', 'pivot', 'experiment-again'] as const
export type SessionDecision = (typeof SESSION_DECISIONS)[number]

/** Assessment maturity levels */
export const MATURITY_LEVELS = ['standing-still', 'crawling', 'walking', 'running', 'flying'] as const
export type MaturityLevel = (typeof MATURITY_LEVELS)[number]

/** Team types */
export const TEAM_TYPES = ['mission', 'platform', 'leadership-circle'] as const
export type TeamType = (typeof TEAM_TYPES)[number]

/** Team member roles */
export const TEAM_ROLES = ['lead', 'member'] as const
export type TeamRole = (typeof TEAM_ROLES)[number]

/** Proactive trigger types */
export const PROACTIVE_TRIGGERS = [
  'stale-assumption',
  'procrastination',
  'health-decline',
  'framework-readiness',
  'missing-context',
] as const
export type ProactiveTrigger = (typeof PROACTIVE_TRIGGERS)[number]

/** Alicia coaching surfaces */
export const COACH_SURFACES = ['dashboard', 'mode-runner', 'chat', 'assessment', 'composability'] as const
export type CoachSurface = (typeof COACH_SURFACES)[number]

/** Health score color for a given score */
export function getHealthColor(score: number): string {
  if (score >= HEALTH_COLORS.green.min) return HEALTH_COLORS.green.color
  if (score >= HEALTH_COLORS.yellow.min) return HEALTH_COLORS.yellow.color
  if (score >= HEALTH_COLORS.orange.min) return HEALTH_COLORS.orange.color
  return HEALTH_COLORS.red.color
}

/** Health trend directions */
export const HEALTH_TRENDS = ['improving', 'stable', 'declining'] as const
export type HealthTrend = (typeof HEALTH_TRENDS)[number]

/** Training program statuses */
export const PROGRAM_STATUSES = ['active', 'completed', 'paused', 'abandoned'] as const
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number]
