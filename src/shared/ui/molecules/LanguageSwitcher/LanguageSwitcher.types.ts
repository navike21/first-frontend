import type { Language } from '@/shared/types/languages'

export interface LanguageSwitcherProps {
  label?: string
}

export interface LanguageFlagProps {
  lang: Language
  className?: string
}
