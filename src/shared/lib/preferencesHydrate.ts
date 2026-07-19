import { useThemeStore, type Theme } from '@/shared/model/theme.store'
import { useLanguageStore } from '@/shared/model/language.store'
import { isSupportedLanguage } from './preferencesSync'
import type { UserPreferences } from '@/shared/types'

const resolveSystemTheme = (): Theme =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

/**
 * Applies the backend's per-user preferences (from login) to the local stores
 * via their `hydrate*` actions, which DON'T queue a save back. `system` theme is
 * resolved to the OS preference; an unknown color/language is ignored.
 */
export const hydratePreferences = (prefs?: UserPreferences): void => {
  if (!prefs) return
  const theme = useThemeStore.getState()

  if (prefs.theme) {
    theme.hydrateTheme(
      prefs.theme === 'system' ? resolveSystemTheme() : prefs.theme
    )
  }
  if (prefs.language && isSupportedLanguage(prefs.language)) {
    useLanguageStore.getState().hydrateLanguage(prefs.language)
  }
}
