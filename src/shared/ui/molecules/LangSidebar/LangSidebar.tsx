import clsx from 'clsx'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import { langDotClass } from '@/shared/lib'
import { LangBadge } from '../../atoms/LangBadge'
import type { LangSidebarProps } from './LangSidebar.types'

/** Barra lateral de idiomas para formularios con varios campos traducibles:
 * badge + nombre nativo + ★ del idioma propio + punto de estado
 * (error/completo/vacío). Ver también `LangTabs` para la variante compacta
 * de un solo campo. */
export const LangSidebar = ({
  editingLanguage,
  userLanguage,
  hasContent,
  hasError,
  label,
  onChange,
}: LangSidebarProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-muted mb-1 text-xs font-medium tracking-wide uppercase">
      {label}
    </span>
    {SUPPORTED_LANGUAGES.map((lang) => {
      const isActive = lang === editingLanguage
      const isUser = lang === userLanguage
      const filled = hasContent(lang)
      const error = hasError(lang)

      return (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={clsx(
            'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
            isActive
              ? 'bg-primary-700/10 ring-primary-700/20 ring-1'
              : 'hover:bg-surface-subtle'
          )}
        >
          <LangBadge lang={lang} />
          <span
            className={clsx(
              'flex-1 truncate text-sm',
              isActive ? 'text-primary-600 font-medium' : 'text-foreground'
            )}
          >
            {NATIVE_LANGUAGE_NAMES[lang]}
          </span>
          {isUser && <span className="text-primary-600 text-[10px]">★</span>}
          <span
            className={clsx(
              'h-2 w-2 shrink-0 rounded-full',
              langDotClass(error, filled)
            )}
          />
        </button>
      )
    })}
  </div>
)
