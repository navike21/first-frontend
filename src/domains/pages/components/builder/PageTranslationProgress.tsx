import clsx from 'clsx'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { LanguageProgress } from '../../model/pageTranslationProgress'

export interface PageTranslationProgressProps {
  progress: Record<Language, LanguageProgress>
  reviewLanguage: Language
  onReviewLanguageChange: (lang: Language) => void
  /** Idioma actual del propio admin — solo para la marca ★, mismo patrón que `userLanguage` en `PageForm`. */
  nativeLanguage: Language
}

/** Porcentaje traducido de un idioma; una página sin texto/imagen todavía no tiene nada que traducir. */
function percentFor({ filled, total }: LanguageProgress): number {
  return total === 0 ? 100 : Math.round((filled / total) * 100)
}

const dotClass = (percent: number): string => {
  if (percent === 100) return 'bg-emerald-500'
  if (percent > 0) return 'bg-amber-500'
  return 'bg-red-500'
}

/**
 * Fila de chips por idioma con el % del lienzo actual ya traducido y un
 * semáforo de color. Elegir un chip cambia qué idioma muestra el lienzo
 * completo (`BuilderCanvas`'s `language` prop) — los campos vacíos en ese
 * idioma quedan visibles de inmediato, listos para completarse.
 */
export const PageTranslationProgress = ({
  progress,
  reviewLanguage,
  onReviewLanguageChange,
  nativeLanguage,
}: PageTranslationProgressProps) => {
  const { t } = usePagesTranslation()

  const statusLabel = (percent: number): string => {
    if (percent === 100) return t.builder.translationProgress.complete
    if (percent > 0) return t.builder.translationProgress.partial
    return t.builder.translationProgress.empty
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted text-xs font-semibold tracking-wide uppercase">
        {t.builder.translationProgress.heading}
      </span>
      <div className="flex flex-wrap gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const percent = percentFor(progress[lang])
          const active = lang === reviewLanguage
          return (
            <button
              key={lang}
              type="button"
              onClick={() => onReviewLanguageChange(lang)}
              aria-label={`${NATIVE_LANGUAGE_NAMES[lang]}: ${percent}% — ${statusLabel(percent)}`}
              className={clsx(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary-700/10 text-primary-600 ring-primary-700/20 ring-1'
                  : 'bg-surface-subtle text-secondary hover:text-foreground'
              )}
            >
              <span
                className={clsx(
                  'h-2 w-2 shrink-0 rounded-full',
                  dotClass(percent)
                )}
              />
              <span className="tracking-wide uppercase">{lang}</span>
              {lang === nativeLanguage && (
                <span className="text-primary-600">★</span>
              )}
              <span className="text-muted tabular-nums">{percent}%</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
