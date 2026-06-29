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

export const LanguageSwitcher = ({ label }: LanguageSwitcherProps) => {
  const { language, handleChange } = useLanguageSwitcher()

  return (
    <Select
      label={label ? `${label}:` : ''}
      options={OPTIONS}
      value={language}
      onChange={(e) => handleChange(e.target.value as Language)}
      lang={language}
      // Mobile: trigger shows the flag only (native name hidden). From `sm` up
      // the language name is shown again. `[&_[data-select-trigger-label]]`
      // targets the trigger's label span exposed by TriggerDisplay.
      className={clsx(
        'w-auto',
        '[&_[data-select-trigger-label]]:hidden',
        'sm:min-w-32 sm:[&_[data-select-trigger-label]]:inline'
      )}
    />
  )
}
