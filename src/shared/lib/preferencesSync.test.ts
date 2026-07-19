import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/shared/api/preferences', () => ({
  preferencesApi: { update: vi.fn().mockResolvedValue({ data: {} }) },
}))
vi.mock('@/shared/model/session.store', () => ({
  useSessionStore: {
    getState: vi.fn(() => ({ token: null as string | null })),
  },
}))

import { preferencesApi } from '@/shared/api/preferences'
import { useSessionStore } from '@/shared/model/session.store'
import { isSupportedLanguage, queuePreferenceSave } from './preferencesSync'

const updateMock = vi.mocked(preferencesApi.update)
const getStateMock = vi.mocked(useSessionStore.getState)

describe('preferencesSync — language guard', () => {
  it('guards supported languages', () => {
    expect(isSupportedLanguage('es')).toBe(true)
    expect(isSupportedLanguage('en')).toBe(true)
    expect(isSupportedLanguage('xx')).toBe(false)
  })
})

describe('queuePreferenceSave — debounced + auth-gated', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    updateMock.mockClear()
  })
  afterEach(() => vi.useRealTimers())

  it('no-ops when unauthenticated (no token)', () => {
    getStateMock.mockReturnValue({
      token: null,
    } as unknown as ReturnType<typeof useSessionStore.getState>)
    queuePreferenceSave({ theme: 'dark' })
    vi.advanceTimersByTime(1000)
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('debounces and merges into a single PATCH when authenticated', () => {
    getStateMock.mockReturnValue({
      token: 'tok',
    } as unknown as ReturnType<typeof useSessionStore.getState>)
    queuePreferenceSave({ theme: 'dark' })
    queuePreferenceSave({ language: 'es' })
    expect(updateMock).not.toHaveBeenCalled() // still within debounce window
    vi.advanceTimersByTime(500)
    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock).toHaveBeenCalledWith({
      theme: 'dark',
      language: 'es',
    })
  })
})
