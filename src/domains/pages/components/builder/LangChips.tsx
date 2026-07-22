import clsx from 'clsx'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { PageLocalizedString } from '../../model/page.types'

export interface LangChipsProps {
  editing: Language
  userLanguage: Language
  values: PageLocalizedString
  onChange: (lang: Language) => void
}

/** Pestañas compactas de idioma con punto de "tiene contenido". */
export const LangChips = ({ editing, userLanguage, values, onChange }: LangChipsProps) => (
  <div className="flex flex-wrap gap-1">
    {SUPPORTED_LANGUAGES.map((lang) => {
      const active = lang === editing
      const filled = !!values?.[lang]?.trim()
      return (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={clsx(
            'inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5',
            'text-[10px] font-semibold uppercase tracking-wider',
            'transition-colors',
            active
              ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
              : 'bg-surface-subtle text-muted hover:text-foreground',
          )}
        >
          {lang}
          {lang === userLanguage && <span className="text-[9px] text-primary-600">★</span>}
          <span className={clsx('h-1 w-1 rounded-full', filled ? 'bg-emerald-500' : 'bg-border')} />
        </button>
      )
    })}
  </div>
)
