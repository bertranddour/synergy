import { beforeEach, describe, expect, it } from 'vitest'
import { useRunnerStore } from './runner'

describe('runner store', () => {
  beforeEach(() => {
    useRunnerStore.getState().reset()
  })

  it('starts with null session', () => {
    const state = useRunnerStore.getState()
    expect(state.sessionId).toBeNull()
    expect(state.fields).toEqual([])
    expect(state.currentFieldIndex).toBe(0)
  })

  it('starts a session', () => {
    useRunnerStore.getState().startSession({
      sessionId: 'session-1',
      modeSlug: 'validation',
      modeName: 'Validation Mode',
      fields: [
        { name: 'Assumption', description: 'Test', type: 'textarea', required: true },
        { name: 'Risk', description: 'Test', type: 'select', required: true },
      ],
    })

    const state = useRunnerStore.getState()
    expect(state.sessionId).toBe('session-1')
    expect(state.modeSlug).toBe('validation')
    expect(state.fields).toHaveLength(2)
    expect(state.currentFieldIndex).toBe(0)
  })

  it('sets field data', () => {
    useRunnerStore.getState().setFieldData(0, 'My assumption')
    expect(useRunnerStore.getState().fieldsData['0']).toBe('My assumption')
  })

  it('advances to next field', () => {
    useRunnerStore.getState().startSession({
      sessionId: 's1',
      modeSlug: 'v',
      modeName: 'V',
      fields: [
        { name: 'A', description: '', type: 'text', required: true },
        { name: 'B', description: '', type: 'text', required: true },
      ],
    })

    useRunnerStore.getState().advanceField()
    expect(useRunnerStore.getState().currentFieldIndex).toBe(1)
  })

  it('does not advance past last field', () => {
    useRunnerStore.getState().startSession({
      sessionId: 's1',
      modeSlug: 'v',
      modeName: 'V',
      fields: [{ name: 'A', description: '', type: 'text', required: true }],
    })

    useRunnerStore.getState().advanceField()
    expect(useRunnerStore.getState().currentFieldIndex).toBe(1) // at length, not beyond
  })

  it('goes to specific field', () => {
    useRunnerStore.getState().goToField(3)
    expect(useRunnerStore.getState().currentFieldIndex).toBe(3)
  })

  it('shows and hides coaching', () => {
    useRunnerStore.getState().showCoaching('Great answer!')
    expect(useRunnerStore.getState().coachingVisible).toBe(true)
    expect(useRunnerStore.getState().coachingMessage).toBe('Great answer!')

    useRunnerStore.getState().hideCoaching()
    expect(useRunnerStore.getState().coachingVisible).toBe(false)
    expect(useRunnerStore.getState().coachingMessage).toBeNull()
  })

  it('resets all state', () => {
    useRunnerStore.getState().startSession({
      sessionId: 's1',
      modeSlug: 'v',
      modeName: 'V',
      fields: [{ name: 'A', description: '', type: 'text', required: true }],
    })
    useRunnerStore.getState().setFieldData(0, 'data')
    useRunnerStore.getState().showCoaching('msg')

    useRunnerStore.getState().reset()

    const state = useRunnerStore.getState()
    expect(state.sessionId).toBeNull()
    expect(state.fields).toEqual([])
    expect(state.fieldsData).toEqual({})
    expect(state.coachingVisible).toBe(false)
  })
})
