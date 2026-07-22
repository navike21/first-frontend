import { useState } from 'react'
import clsx from 'clsx'
import { InputField } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { SiteLocalizedString } from '../../model/site-config.types'

export interface LocalizedFieldProps {
  label: string
  value: SiteLocalizedString
  userLanguage: Language
  disabled?: boolean
  onChange: (lang: Language, text: string) => void
}

// Compact per-language text input: language chips on top, one input below
// (same interaction as the localized name fields in categories/tags).
export const LocalizedField = ({ label, value, userLanguage, disabled, onChange }: LocalizedFieldProps) => {
  const [editingLanguage, setEditingLanguage] = useState<Language>(userLanguage)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = lang === editingLanguage
          const filled = !!value?.[lang]?.trim()
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setEditingLanguage(lang)}
              className={clsx(
                'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1',
                'text-xs font-semibold uppercase tracking-wider',
                'transition-colors',
                active
                  ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
                  : 'bg-surface-subtle text-muted hover:text-foreground',
              )}
            >
              {lang}
              {lang === userLanguage && <span className="text-[10px] text-primary-600">★</span>}
              <span className={clsx('h-1.5 w-1.5 rounded-full', filled ? 'bg-emerald-500' : 'bg-border')} />
            </button>
          )
        })}
      </div>
      <InputField
        label={label}
        value={value?.[editingLanguage] ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(editingLanguage, e.target.value)}
      />
    </div>
  )
}
