import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

const THEME_KEY = '_first_theme'

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try { return localStorage.getItem(key) } catch { return null }
  },
  setItem: (key: string, value: string): void => {
    try { localStorage.setItem(key, value) } catch { /* unavailable */ }
  },
  removeItem: (key: string): void => {
    try { localStorage.removeItem(key) } catch { /* unavailable */ }
  },
}

const detectSystemTheme = (): Theme =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

interface ThemeState {
  theme: Theme
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: detectSystemTheme(),

        setTheme: (theme) => {
          applyTheme(theme)
          set({ theme }, false, 'theme/setTheme')
        },

        toggleTheme: () => {
          const next: Theme = get().theme === 'light' ? 'dark' : 'light'
          applyTheme(next)
          set({ theme: next }, false, 'theme/toggleTheme')
        },
      }),
      {
        name: THEME_KEY,
        storage: createJSONStorage(() => safeLocalStorage),
        onRehydrateStorage: () => (state) => {
          if (state) applyTheme(state.theme)
        },
      }
    ),
    { name: 'ThemeStore' }
  )
)

export const useTheme = (): Theme => useThemeStore((s) => s.theme)
export const useToggleTheme = (): (() => void) => useThemeStore((s) => s.toggleTheme)
