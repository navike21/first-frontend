import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/shared/api/preferences', () => ({
  preferencesApi: { update: vi.fn().mockResolvedValue({ data: {} }) },
}))
vi.mock('@/shared/model/session.store', () => ({
  useSessionStore: { getState: vi.fn(() => ({ token: null as string | null })) },
}))

import { preferencesApi } from '@/shared/api/preferences'
import { useSessionStore } from '@/shared/model/session.store'
import {
  brandColorToHex,
  hexToBrandColor,
  isSupportedLanguage,
  queuePreferenceSave,
} from './preferencesSync'

const updateMock = vi.mocked(preferencesApi.update)
const getStateMock = vi.mocked(useSessionStore.getState)

describe('preferencesSync — color/language mapping', () => {
  it('round-trips a brand color through hex losslessly', () => {
    expect(brandColorToHex('teal')).toBe('#0081a2')
    expect(hexToBrandColor('#0081A2')).toBe('teal') // case-insensitive
    expect(hexToBrandColor('#0ea5e9')).toBe('sky')
  })

  it('returns undefined for an unknown hex', () => {
    expect(hexToBrandColor('#ffffff')).toBeUndefined()
  })

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
    getStateMock.mockReturnValue({ token: null })
    queuePreferenceSave({ theme: 'dark' })
    vi.advanceTimersByTime(1000)
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('debounces and merges into a single PATCH when authenticated', () => {
    getStateMock.mockReturnValue({ token: 'tok' })
    queuePreferenceSave({ theme: 'dark' })
    queuePreferenceSave({ primaryColor: '#0081a2' })
    expect(updateMock).not.toHaveBeenCalled() // still within debounce window
    vi.advanceTimersByTime(500)
    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock).toHaveBeenCalledWith({
      theme: 'dark',
      primaryColor: '#0081a2',
    })
  })
})
