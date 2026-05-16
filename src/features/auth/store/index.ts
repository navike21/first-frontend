import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProfile } from '../model/types'

interface AuthState {
  currentUser: UserProfile | null
  permissions: string[]
  isAuthenticated: boolean
  setUser: (user: UserProfile) => void
  setPermissions: (permissions: string[]) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      permissions: [],
      isAuthenticated: false,

      setUser: (user) =>
        set({
          currentUser: user,
          permissions: user.permissions,
          isAuthenticated: true,
        }),

      setPermissions: (permissions) => set({ permissions }),

      clearAuth: () =>
        set({
          currentUser: null,
          permissions: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: 'first-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
