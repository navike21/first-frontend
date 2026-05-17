import { Select } from '@/shared/ui'
import { NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useHeaderTranslation } from '../i18n'

const OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  value: lang,
  label: NATIVE_LANGUAGE_NAMES[lang],
}))

export const LanguageSwitcher = () => {
  const { t, language, setLanguage } = useHeaderTranslation()

  return (
    <Select
      label={t.language.label}
      options={OPTIONS}
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      lang={language}
      className="w-40"
    />
  )
}
