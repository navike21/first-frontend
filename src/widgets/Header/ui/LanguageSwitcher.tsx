import { useRouter } from '@tanstack/react-router'
import { Select } from '@/shared/ui'
import { NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { translatePath } from '@/shared/router'
import type { Language } from '@/shared/i18n'
import { useHeaderTranslation } from '../i18n'

const OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  value: lang,
  label: NATIVE_LANGUAGE_NAMES[lang],
}))

export const LanguageSwitcher = () => {
  const { t, language, setLanguage } = useHeaderTranslation()
  const router = useRouter()

  const handleChange = (newLang: Language) => {
    setLanguage(newLang)
    const currentPath = router.state.location.pathname
    const newPath = translatePath(currentPath, newLang)
    void router.navigate({ to: newPath as never, replace: true })
  }

  return (
    <Select
      label={`${t.language.label}:`}
      options={OPTIONS}
      value={language}
      onChange={(e) => handleChange(e.target.value as Language)}
      lang={language}
      className="min-w-32"
    />
  )
}
