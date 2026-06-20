import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useSessionStore,
  TOKEN_KEY,
  isTokenStored,
  useIsAuthenticated,
} from './session.store'
import type { AuthUser } from '@/shared/types'

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

// Factory
const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@navike21.com',
  permissions: [],
  ...overrides,
})

/** Builds the JSON blob that the persist middleware writes under TOKEN_KEY. */
const makePersistedBlob = (state: {
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
}): string => JSON.stringify({ state, version: 0 })

describe('useSessionStore', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockStorage.clear()
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
  })

  describe('initial state', () => {
    it('should start unauthenticated when localStorage is empty', () => {
      // Arrange & Act
      const { isAuthenticated, token, user } = useSessionStore.getState()
      // Assert
      expect(isAuthenticated).toBe(false)
      expect(token).toBeNull()
      expect(user).toBeNull()
    })
  })

  describe('setSession', () => {
    it('should set isAuthenticated, token, and user in store', () => {
      // Arrange
      const mockUser = makeAuthUser()
      // Act
      useSessionStore.getState().setSession('tok-123', mockUser)
      const state = useSessionStore.getState()
      // Assert
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe('tok-123')
      expect(state.user).toEqual(mockUser)
    })

    it('should persist session as JSON blob under TOKEN_KEY', () => {
      // Arrange
      const mockUser = makeAuthUser()
      // Act
      useSessionStore.getState().setSession('tok-abc', mockUser)
      // Assert — persist writes a JSON blob, not the raw token
      const raw = mockStorage.getItem(TOKEN_KEY)
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw!) as { state: { token: string } }
      expect(parsed.state.token).toBe('tok-abc')
    })

    it('should make isTokenStored return true after setSession', () => {
      // Arrange
      const mockUser = makeAuthUser()
      // Act
      useSessionStore.getState().setSession('tok-abc', mockUser)
      // Assert
      expect(isTokenStored()).toBe(true)
    })
  })

  describe('clearSession', () => {
    it('should reset isAuthenticated, token, and user to null/false', () => {
      // Arrange
      const mockUser = makeAuthUser()
      useSessionStore.getState().setSession('tok-123', mockUser)
      // Act
      useSessionStore.getState().clearSession()
      const state = useSessionStore.getState()
      // Assert
      expect(state.isAuthenticated).toBe(false)
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
    })

    it('should make isTokenStored return false after clearSession', () => {
      // Arrange
      const mockUser = makeAuthUser()
      useSessionStore.getState().setSession('tok-123', mockUser)
      // Act
      useSessionStore.getState().clearSession()
      // Assert
      expect(isTokenStored()).toBe(false)
    })
  })

  describe('isTokenStored', () => {
    it('should return false when localStorage is empty', () => {
      // Arrange — storage cleared in beforeEach
      // Act & Assert
      expect(isTokenStored()).toBe(false)
    })

    it('should return true when a valid persist blob with token is present', () => {
      // Arrange
      const mockUser = makeAuthUser()
      mockStorage.setItem(
        TOKEN_KEY,
        makePersistedBlob({
          isAuthenticated: true,
          token: 'tok-xyz',
          user: mockUser,
        })
      )
      // Act & Assert
      expect(isTokenStored()).toBe(true)
    })

    it('should return false when persist blob has null token', () => {
      // Arrange
      mockStorage.setItem(
        TOKEN_KEY,
        makePersistedBlob({ isAuthenticated: false, token: null, user: null })
      )
      // Act & Assert
      expect(isTokenStored()).toBe(false)
    })

    it('should return false when storage value is malformed JSON', () => {
      // Arrange
      mockStorage.setItem(TOKEN_KEY, 'not-valid-json')
      // Act & Assert
      expect(isTokenStored()).toBe(false)
    })
  })

  describe('safeLocalStorage error handling', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('does not throw when localStorage.removeItem fails', () => {
      vi.spyOn(mockStorage, 'removeItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useSessionStore.persist.clearStorage()).not.toThrow()
    })
  })

  describe('useIsAuthenticated', () => {
    it('returns false when not authenticated', () => {
      useSessionStore.setState({
        isAuthenticated: false,
        token: null,
        user: null,
      })
      const { result } = renderHook(() => useIsAuthenticated())
      expect(result.current).toBe(false)
    })

    it('returns true when authenticated', () => {
      useSessionStore.getState().setSession('tok', makeAuthUser())
      const { result } = renderHook(() => useIsAuthenticated())
      expect(result.current).toBe(true)
    })
  })
})
