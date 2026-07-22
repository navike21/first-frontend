import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { Language } from '@/shared/types/languages'
import { queuePreferenceSave } from '@/shared/lib/preferencesSync'

const LANGUAGE_KEY = '_first_lang'

// Keeps <html lang> in sync with the active UI language — otherwise it stays
// stuck at index.html's static value forever, and the browser's own
// translate heuristics (Chrome's "Translate this page?") misdetect the
// content language and offer to translate a page that's already in the
// user's language (confirmed: reported live on a phone with both Chrome and
// First set to Spanish, still prompted to translate).
const applyLanguage = (lang: Language): void => {
  document.documentElement.lang = lang
}

interface LanguageState {
  language: Language
}

interface LanguageActions {
  setLanguage: (lang: Language) => void
  /** Apply language without persisting to the backend (used on login hydrate). */
  hydrateLanguage: (lang: Language) => void
}

type LanguageStore = LanguageState & LanguageActions

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

export const useLanguageStore = create<LanguageStore>()(
  devtools(
    persist(
      (set) => ({
        language: 'es',
        setLanguage: (lang) => {
          applyLanguage(lang)
          set({ language: lang }, false, 'language/setLanguage')
          queuePreferenceSave({ language: lang })
        },
        hydrateLanguage: (lang) => {
          applyLanguage(lang)
          set({ language: lang }, false, 'language/hydrateLanguage')
        },
      }),
      {
        name: LANGUAGE_KEY,
        storage: createJSONStorage(() => safeLocalStorage),
        onRehydrateStorage: () => (state) => {
          if (state) applyLanguage(state.language)
        },
      }
    ),
    { name: 'LanguageStore' }
  )
)

export const useLanguage = (): Language =>
  useLanguageStore((state) => state.language)
