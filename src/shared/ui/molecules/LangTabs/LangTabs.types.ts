import type { ReactNode } from 'react'
import type { Language } from '@/shared/i18n'

export interface LangTabsProps {
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  onChange: (lang: Language) => void
  /** Optional trailing action (e.g. an AI-translate trigger) rendered after
   * the language chips — additive, existing consumers are unaffected. */
  extra?: ReactNode
}
