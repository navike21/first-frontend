import { useTranslation, NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'

export const LanguageSwitcher = () => {
  const { t, language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center gap-1.5">
      <label
        htmlFor="language-switcher"
        className="hidden text-xs font-medium text-slate-500 sm:block"
      >
        {t.language.label}
      </label>
      <select
        id="language-switcher"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-xs outline-none transition-colors duration-fast ease-out-expo hover:border-gray-300 hover:bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        aria-label={t.language.label}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {NATIVE_LANGUAGE_NAMES[lang]}
          </option>
        ))}
      </select>
    </div>
  )
}
