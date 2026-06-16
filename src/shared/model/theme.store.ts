import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import {
  queuePreferenceSave,
  brandColorToHex,
} from '@/shared/lib/preferencesSync'

export type Theme = 'light' | 'dark'
export type BrandColor =
  | 'teal'
  | 'violet'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'sky'
  | 'indigo'
  | 'orange'
  | 'pink'
  | 'cyan'

const THEME_KEY = '_first_theme'

const BRAND_COLORS: BrandColor[] = [
  'teal',
  'violet',
  'emerald',
  'rose',
  'amber',
  'sky',
  'indigo',
  'orange',
  'pink',
  'cyan',
]

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
      /* unavailable */
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* unavailable */
    }
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

const applyColor = (color: BrandColor): void => {
  const el = document.documentElement
  for (const c of BRAND_COLORS) el.classList.remove(`color-${c}`)
  el.classList.add(`color-${color}`)
}

interface ThemeState {
  theme: Theme
  color: BrandColor
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setColor: (color: BrandColor) => void
  /** Apply theme without persisting to the backend (used on login hydrate). */
  hydrateTheme: (theme: Theme) => void
  /** Apply color without persisting to the backend (used on login hydrate). */
  hydrateColor: (color: BrandColor) => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: detectSystemTheme(),
        color: 'teal',

        setTheme: (theme) => {
          applyTheme(theme)
          set({ theme }, false, 'theme/setTheme')
          queuePreferenceSave({ theme })
        },

        toggleTheme: () => {
          const next: Theme = get().theme === 'light' ? 'dark' : 'light'
          applyTheme(next)
          set({ theme: next }, false, 'theme/toggleTheme')
          queuePreferenceSave({ theme: next })
        },

        setColor: (color) => {
          applyColor(color)
          set({ color }, false, 'theme/setColor')
          queuePreferenceSave({ primaryColor: brandColorToHex(color) })
        },

        hydrateTheme: (theme) => {
          applyTheme(theme)
          set({ theme }, false, 'theme/hydrateTheme')
        },

        hydrateColor: (color) => {
          applyColor(color)
          set({ color }, false, 'theme/hydrateColor')
        },
      }),
      {
        name: THEME_KEY,
        storage: createJSONStorage(() => safeLocalStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            applyTheme(state.theme)
            applyColor(state.color)
          }
        },
      }
    ),
    { name: 'ThemeStore' }
  )
)

export const useTheme = (): Theme => useThemeStore((s) => s.theme)
export const useToggleTheme = (): (() => void) =>
  useThemeStore((s) => s.toggleTheme)
export const useBrandColor = (): BrandColor => useThemeStore((s) => s.color)
export const useSetColor = (): ((c: BrandColor) => void) =>
  useThemeStore((s) => s.setColor)
