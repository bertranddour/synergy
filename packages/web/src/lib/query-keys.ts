/** Centralized query key factory for TanStack Query consistency */
export const queryKeys = {
  health: {
    all: ['health'] as const,
    detail: (category: string) => ['health', category] as const,
  },
  modes: {
    all: (params?: { framework?: string; search?: string }) => ['modes', params] as const,
    detail: (slug: string) => ['mode', slug] as const,
  },
  sessions: {
    all: (params?: { status?: string }) => ['sessions', params] as const,
    detail: (id: string) => ['session', id] as const,
  },
  progress: {
    current: ['progress'] as const,
    history: ['progress-history'] as const,
  },
  coach: {
    proactive: ['proactive'] as const,
  },
  assessments: {
    all: ['assessments'] as const,
    detail: (id: string) => ['assessment', id] as const,
  },
  programs: {
    all: ['programs'] as const,
    active: ['program-active'] as const,
  },
  teams: {
    all: ['teams'] as const,
    detail: (id: string) => ['team', id] as const,
    health: (id: string) => ['team-health', id] as const,
  },
  frameworks: {
    all: ['frameworks'] as const,
  },
} as const
