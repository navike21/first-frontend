import clsx from 'clsx'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { langDotClass } from '@/shared/lib'
import type { LangTabsProps } from './LangTabs.types'

/** Fila compacta de chips de idioma para formularios con un solo campo
 * traducible: código de idioma + ★ del idioma propio + punto de estado
 * (error/completo/vacío). Ver también `LangSidebar` para la variante con
 * badge y nombre completo, usada cuando hay varios campos traducibles. */
export const LangTabs = ({ editingLanguage, userLanguage, hasContent, hasError, onChange }: LangTabsProps) => (
  <div className="flex flex-wrap gap-1.5">
    {SUPPORTED_LANGUAGES.map((lang) => {
      const isActive = lang === editingLanguage
      const filled = hasContent(lang)
      const error = hasError(lang)
      return (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
            'text-xs font-semibold uppercase tracking-wider',
            'transition-colors',
            isActive
              ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
              : 'bg-surface-subtle text-muted hover:text-foreground',
          )}
        >
          {lang}
          {lang === userLanguage && <span className="text-[10px] text-primary-600">★</span>}
          <span className={clsx('h-1.5 w-1.5 rounded-full', langDotClass(error, filled))} />
        </button>
      )
    })}
  </div>
)
