import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('starts with null token and user', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('sets auth with token and user', () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      stage: 'solo',
      teamSize: 1,
      onboardingCompleted: false,
    }

    useAuthStore.getState().setAuth('jwt-token', user)

    const state = useAuthStore.getState()
    expect(state.token).toBe('jwt-token')
    expect(state.user).toEqual(user)
  })

  it('clears auth', () => {
    useAuthStore.getState().setAuth('jwt-token', {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test',
      avatarUrl: null,
      stage: 'solo',
      teamSize: 1,
      onboardingCompleted: false,
    })

    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('updates user partially', () => {
    useAuthStore.getState().setAuth('jwt-token', {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Old Name',
      avatarUrl: null,
      stage: 'solo',
      teamSize: 1,
      onboardingCompleted: false,
    })

    useAuthStore.getState().updateUser({ name: 'New Name', stage: 'small-team' })

    const state = useAuthStore.getState()
    expect(state.user?.name).toBe('New Name')
    expect(state.user?.stage).toBe('small-team')
    expect(state.user?.email).toBe('test@example.com') // unchanged
  })

  it('updateUser does nothing when no user', () => {
    useAuthStore.getState().updateUser({ name: 'Nobody' })
    expect(useAuthStore.getState().user).toBeNull()
  })
})
