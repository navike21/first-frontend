import type { Language } from '@/shared/i18n'

export interface LangSidebarProps {
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  label: string
  onChange: (lang: Language) => void
}
