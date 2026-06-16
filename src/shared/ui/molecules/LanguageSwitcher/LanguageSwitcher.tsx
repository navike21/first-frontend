import { Select } from '@/shared/ui/molecules/Select'
import { NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/types/languages'
import { useLanguageSwitcher } from './LanguageSwitcher.hooks'

const OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  value: lang,
  label: NATIVE_LANGUAGE_NAMES[lang],
}))

export interface LanguageSwitcherProps {
  label?: string
}

export const LanguageSwitcher = ({ label }: LanguageSwitcherProps) => {
  const { language, handleChange } = useLanguageSwitcher()

  return (
    <Select
      label={label ? `${label}:` : ''}
      options={OPTIONS}
      value={language}
      onChange={(e) => handleChange(e.target.value as Language)}
      lang={language}
      className="min-w-32"
    />
  )
}
