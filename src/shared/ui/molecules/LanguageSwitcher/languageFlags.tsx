import ES from 'country-flag-icons/react/3x2/ES'
import US from 'country-flag-icons/react/3x2/US'
import DE from 'country-flag-icons/react/3x2/DE'
import FR from 'country-flag-icons/react/3x2/FR'
import BR from 'country-flag-icons/react/3x2/BR'
import IT from 'country-flag-icons/react/3x2/IT'
import JP from 'country-flag-icons/react/3x2/JP'
import KR from 'country-flag-icons/react/3x2/KR'
import CN from 'country-flag-icons/react/3x2/CN'
import RU from 'country-flag-icons/react/3x2/RU'
import type { Language } from '@/shared/types/languages'
import type { LanguageFlagProps } from './LanguageSwitcher.types'

// Conventional language → country-flag mapping (languages aren't countries).
const LANGUAGE_FLAG: Record<Language, typeof ES> = {
  es: ES,
  en: US,
  de: DE,
  fr: FR,
  pt: BR,
  it: IT,
  ja: JP,
  ko: KR,
  zh: CN,
  ru: RU,
}

/** Renders the flag SVG associated with a language. */
export const LanguageFlag = ({ lang, className }: LanguageFlagProps) => {
  const Flag = LANGUAGE_FLAG[lang]
  return <Flag className={className} />
}
