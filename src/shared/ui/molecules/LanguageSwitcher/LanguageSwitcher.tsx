import clsx from 'clsx'
import { Select } from '@/shared/ui/molecules/Select'
import { NATIVE_LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/types/languages'
import { useLanguageSwitcher } from './LanguageSwitcher.hooks'
import { LanguageFlag } from './languageFlags'
import type { LanguageSwitcherProps } from './LanguageSwitcher.types'

const OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  value: lang,
  label: NATIVE_LANGUAGE_NAMES[lang],
  leftSlot: (
    <LanguageFlag lang={lang} className="h-4 w-6 shrink-0 rounded-xs" />
  ),
}))

export const LanguageSwitcher = ({ label, className }: LanguageSwitcherProps) => {
  const { language, handleChange } = useLanguageSwitcher()

  return (
    <Select
      label={label ? `${label}:` : ''}
      options={OPTIONS}
      value={language}
      onChange={(e) => handleChange(e.target.value as Language)}
      lang={language}
      // Default: compact trigger (flag only on mobile, name from sm up).
      // Pass className to override — e.g. w-full + always-visible label in drawers.
      className={clsx(
        'w-auto',
        '[&_[data-select-trigger-label]]:hidden',
        'sm:min-w-32 sm:[&_[data-select-trigger-label]]:inline',
        className
      )}
    />
  )
}
