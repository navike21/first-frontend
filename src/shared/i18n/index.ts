import { useLanguageStore } from '@/shared/model/language.store'
import type { Language } from '@/shared/types/languages'

export type { Language } from '@/shared/types/languages'
export { SUPPORTED_LANGUAGES } from '@/shared/types/languages'

/** Each language name written in its own script — used by every language switcher. */
export const NATIVE_LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  pt: 'Português',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ru: 'Русский',
}

/**
 * Factory that creates a typed useTranslation hook for any module.
 *
 * Usage:
 *   const useMyTranslation = createTranslations({ es, en, de, … })
 *   // inside component:
 *   const { t, language, setLanguage } = useMyTranslation()
 */
export function createTranslations<T>(locales: Record<Language, T>) {
  return (): {
    t: T
    language: Language
    setLanguage: (lang: Language) => void
  } => {
    const language = useLanguageStore((state) => state.language)
    const setLanguage = useLanguageStore((state) => state.setLanguage)
    return { t: locales[language], language, setLanguage }
  }
}
