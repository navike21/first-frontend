import { useLanguageStore } from '@/shared/model/language.store'
import type { Language } from '@/shared/types/languages'
import type { Translations } from './types'
import { es } from './locales/es'
import { en } from './locales/en'
import { de } from './locales/de'
import { fr } from './locales/fr'
import { pt } from './locales/pt'
import { it } from './locales/it'
import { ja } from './locales/ja'
import { ko } from './locales/ko'
import { zh } from './locales/zh'
import { ru } from './locales/ru'

export type { Translations } from './types'
export { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
export type { Language } from '@/shared/types/languages'

const locales: Record<Language, Translations> = {
  es, en, de, fr, pt, it, ja, ko, zh, ru,
}

/** Native language name for display in the switcher (e.g. "Español", "English", "日本語") */
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

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  return {
    t: locales[language],
    language,
    setLanguage,
  }
}
