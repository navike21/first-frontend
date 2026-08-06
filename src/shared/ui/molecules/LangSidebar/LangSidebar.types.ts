import type { ReactNode } from 'react'
import type { Language } from '@/shared/i18n'

export interface LangSidebarProps {
  /** Which languages to render — normally the business's configured content-
   * language scope (`useContentLanguages()`), not necessarily every language
   * First's own UI supports. */
  languages: readonly Language[]
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  label: string
  onChange: (lang: Language) => void
  /** Optional trailing action (e.g. an AI-translate trigger) rendered below
   * the language list — additive, existing consumers are unaffected. */
  extra?: ReactNode
}
