import type { Language } from '@/shared/i18n'
import { isColumnsSection } from './page.builder'
import type { BuilderElement, BuilderSection } from './page.types'

/** TipTap emite `<p></p>` cuando está "vacío": sin este chequeo un texto
 * recién creado (o borrado) contaría como lleno. */
export function isEmptyHtml(html: string | undefined): boolean {
  if (!html) return true
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  return !text.trim()
}

/** `'html'` usa `isEmptyHtml` (contenido de un editor TipTap); `'text'` usa
 * un trim plano (texto simple, p. ej. el alt de una imagen). */
export function isLocalizedFilled(value: string | undefined, kind: 'html' | 'text'): boolean {
  return kind === 'html' ? !isEmptyHtml(value) : !!value?.trim()
}

export interface LanguageProgress {
  filled: number
  total: number
}

function accumulateLocalizedField(
  progress: Record<Language, LanguageProgress>,
  value: Record<Language, string>,
  kind: 'html' | 'text',
  languages: readonly Language[],
): void {
  for (const lang of languages) {
    progress[lang].total += 1
    if (isLocalizedFilled(value[lang], kind)) progress[lang].filled += 1
  }
}

function accumulateElement(
  progress: Record<Language, LanguageProgress>,
  element: BuilderElement,
  languages: readonly Language[],
): void {
  if (element.type === 'slider') return
  if (element.type === 'text') return accumulateLocalizedField(progress, element.html, 'html', languages)
  if (element.type === 'image') return accumulateLocalizedField(progress, element.alt, 'text', languages)
  if (element.type === 'button') return accumulateLocalizedField(progress, element.label, 'text', languages)
  if (element.type === 'gallery') {
    for (const image of element.images) accumulateLocalizedField(progress, image.alt, 'text', languages)
    return
  }
  if (element.type === 'accordion') {
    for (const item of element.items) {
      accumulateLocalizedField(progress, item.question, 'text', languages)
      accumulateLocalizedField(progress, item.answer, 'html', languages)
    }
    return
  }
  const _exhaustive: never = element
  return _exhaustive
}

/**
 * Cuenta, por idioma, cuántos campos traducibles del lienzo tienen
 * contenido: `html` de `text`, `alt` de `image`, `label` de `button`, `alt`
 * por imagen de `gallery` (escala con la cantidad de imágenes), y
 * `question`+`answer` por item de `accordion` (2 campos por item). Los
 * sliders no aportan — no tienen ningún campo localizado. Página sin
 * contenido traducible todavía → `total: 0`, tratado como 100% en el
 * consumidor (nada que traducir, no es un estado de error).
 */
export function computeTranslationProgress(
  sections: BuilderSection[],
  languages: readonly Language[],
): Record<Language, LanguageProgress> {
  const progress = Object.fromEntries(languages.map((lang) => [lang, { filled: 0, total: 0 }])) as Record<
    Language,
    LanguageProgress
  >

  for (const section of sections) {
    if (!isColumnsSection(section)) continue
    for (const column of section.content.columns ?? []) {
      for (const element of column.elements) {
        accumulateElement(progress, element, languages)
      }
    }
  }

  return progress
}
