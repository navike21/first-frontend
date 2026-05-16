import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '@/shared/types'

export const TOKEN_KEY = '_pt_token'

interface SessionState {
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
}

interface SessionActions {
  clearSession: () => void
  setSession: (token: string, user: AuthUser) => void
}

type SessionStore = SessionState & SessionActions

const initialState: SessionState = {
  isAuthenticated: false,
  token: null,
  user: null,
}

/**
 * Lazily-bound localStorage adapter with error-safe methods.
 * Reads globalThis.localStorage at call time so test stubs applied via
 * vi.stubGlobal are respected, and the try/catch ensures the persist
 * middleware never throws when localStorage is unavailable.
 */
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* storage unavailable */
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage unavailable */
    }
  },
}

/**
 * Synchronously checks if a valid session token exists in persisted storage.
 * Parses the JSON blob written by the persist middleware under TOKEN_KEY.
 */
export const isTokenStored = (): boolean => {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (raw === null) return false
    const parsed = JSON.parse(raw) as { state?: { token?: unknown } }
    return typeof parsed.state?.token === 'string'
  } catch {
    return false
  }
}

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        clearSession: () => {
          set(initialState, false, 'session/clearSession')
        },

        setSession: (token, user) => {
          set({ isAuthenticated: true, token, user }, false, 'session/setSession')
        },
      }),
      {
        name: TOKEN_KEY,
        storage: createJSONStorage(() => safeLocalStorage),
        partialize: ({ isAuthenticated, token, user }) => ({
          isAuthenticated,
          token,
          user,
        }),
      },
    ),
    { name: 'SessionStore' },
  ),
)

/** Shorthand selector — use anywhere to gate private UI */
export const useIsAuthenticated = (): boolean => useSessionStore((state) => state.isAuthenticated)
