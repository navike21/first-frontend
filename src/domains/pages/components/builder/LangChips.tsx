import clsx from 'clsx'
import type { Language } from '@/shared/i18n'
import type { PageLocalizedString } from '../../model/page.types'

export interface LangChipsProps {
  languages: readonly Language[]
  editing: Language
  userLanguage: Language
  values: PageLocalizedString
  onChange: (lang: Language) => void
}

/**
 * Pestañas compactas de idioma con punto de "tiene contenido". No renderiza
 * nada si el alcance de idiomas de contenido es uno solo — no hay nada entre
 * qué cambiar.
 */
export const LangChips = ({
  languages,
  editing,
  userLanguage,
  values,
  onChange,
}: LangChipsProps) => {
  if (languages.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((lang) => {
        const active = lang === editing
        const filled = !!values?.[lang]?.trim()
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            className={clsx(
              'inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5',
              'text-[10px] font-semibold tracking-wider uppercase',
              'transition-colors',
              active
                ? 'bg-primary-700/10 text-primary-600 ring-primary-700/20 ring-1'
                : 'bg-surface-subtle text-muted hover:text-foreground'
            )}
          >
            {lang}
            {lang === userLanguage && (
              <span className="text-primary-600 text-[9px]">★</span>
            )}
            <span
              className={clsx(
                'h-1 w-1 rounded-full',
                filled ? 'bg-emerald-500' : 'bg-border'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
