import type { ReactNode } from 'react'
import type { Language } from '@/shared/i18n'

export interface LangTabsProps {
  /** Which languages to render — normally the business's configured content-
   * language scope (`useContentLanguages()`), not necessarily every language
   * First's own UI supports. */
  languages: readonly Language[]
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  onChange: (lang: Language) => void
  /** Optional trailing action (e.g. an AI-translate trigger) rendered after
   * the language chips — additive, existing consumers are unaffected. */
  extra?: ReactNode
}
