import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TOKEN_KEY } from '@/shared/model'

const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value
    },
    removeItem: (key: string): void => {
      delete store[key]
    },
    clear: (): void => {
      store = {}
    },
  }
})()

vi.stubGlobal('localStorage', mockStorage)

const redirectMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  redirect: (args: unknown) => {
    redirectMock(args)
    throw new Error('redirect')
  },
}))

import { requireAuth, requireGuest } from './guards'

/** Builds the persist JSON blob that isTokenStored() parses. */
const makePersistedToken = (token: string): string =>
  JSON.stringify({
    state: { isAuthenticated: true, token, user: null },
    version: 0,
  })

describe('guards', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockStorage.clear()
  })

  describe('requireAuth', () => {
    it('should not throw when a valid persisted token is present', () => {
      // Arrange
      mockStorage.setItem(TOKEN_KEY, makePersistedToken('tok-123'))
      // Act & Assert
      expect(() => requireAuth()).not.toThrow()
    })

    it('should throw redirect to /no-autorizado when no token is present', () => {
      // Arrange — no token in storage
      // Act & Assert
      expect(() => requireAuth()).toThrow('redirect')
      expect(redirectMock).toHaveBeenCalledWith({ to: '/no-autorizado' })
    })
  })

  describe('requireGuest', () => {
    it('should not throw when no token is present', () => {
      // Arrange — no token in storage
      // Act & Assert
      expect(() => requireGuest()).not.toThrow()
    })

    it('should throw redirect to / when a valid persisted token exists', () => {
      // Arrange
      mockStorage.setItem(TOKEN_KEY, makePersistedToken('tok-123'))
      // Act & Assert
      expect(() => requireGuest()).toThrow('redirect')
      expect(redirectMock).toHaveBeenCalledWith({ to: '/' })
    })
  })
})
