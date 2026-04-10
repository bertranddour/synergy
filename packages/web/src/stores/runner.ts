import { create } from 'zustand'

interface FieldSchema {
  name: string
  description: string
  type: string
  required: boolean
  example?: string
  options?: string[]
}

interface RunnerState {
  sessionId: string | null
  modeSlug: string | null
  modeName: string | null
  fields: FieldSchema[]
  currentFieldIndex: number
  fieldsData: Record<string, unknown>
  coachingVisible: boolean
  coachingMessage: string | null

  startSession: (params: { sessionId: string; modeSlug: string; modeName: string; fields: FieldSchema[] }) => void
  setFieldData: (index: number, data: unknown) => void
  advanceField: () => void
  goToField: (index: number) => void
  showCoaching: (message: string) => void
  hideCoaching: () => void
  reset: () => void
}

export const useRunnerStore = create<RunnerState>((set) => ({
  sessionId: null,
  modeSlug: null,
  modeName: null,
  fields: [],
  currentFieldIndex: 0,
  fieldsData: {},
  coachingVisible: false,
  coachingMessage: null,

  startSession: (params) =>
    set({
      sessionId: params.sessionId,
      modeSlug: params.modeSlug,
      modeName: params.modeName,
      fields: params.fields,
      currentFieldIndex: 0,
      fieldsData: {},
      coachingVisible: false,
      coachingMessage: null,
    }),

  setFieldData: (index, data) =>
    set((state) => ({
      fieldsData: { ...state.fieldsData, [String(index)]: data },
    })),

  advanceField: () =>
    set((state) => ({
      currentFieldIndex: Math.min(state.currentFieldIndex + 1, state.fields.length),
      coachingVisible: false,
      coachingMessage: null,
    })),

  goToField: (index) =>
    set({
      currentFieldIndex: index,
      coachingVisible: false,
      coachingMessage: null,
    }),

  showCoaching: (message) => set({ coachingVisible: true, coachingMessage: message }),

  hideCoaching: () => set({ coachingVisible: false, coachingMessage: null }),

  reset: () =>
    set({
      sessionId: null,
      modeSlug: null,
      modeName: null,
      fields: [],
      currentFieldIndex: 0,
      fieldsData: {},
      coachingVisible: false,
      coachingMessage: null,
    }),
}))
