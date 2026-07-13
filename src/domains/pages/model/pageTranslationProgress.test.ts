import { describe, it, expect } from 'vitest'
import type { Language } from '@/shared/i18n'
import type {
  BuilderSection,
  BuilderElement,
  BuilderTextElement,
  BuilderImageElement,
  BuilderSliderElement,
} from './page.types'
import { isEmptyHtml, isLocalizedFilled, computeTranslationProgress } from './pageTranslationProgress'

const LANGS = ['es', 'en'] as Language[]

const localized = (es?: string, en?: string): Record<Language, string> => ({ es: es ?? '', en: en ?? '' }) as Record<Language, string>

const textElement = (es?: string, en?: string): BuilderTextElement => ({
  id: 'text-1',
  type: 'text',
  html: localized(es, en),
})

const imageElement = (es?: string, en?: string): BuilderImageElement => ({
  id: 'image-1',
  type: 'image',
  url: 'photo.jpg',
  alt: localized(es, en),
  width: '',
  height: '',
  align: 'left',
})

const sliderElement = (): BuilderSliderElement => ({
  id: 'slider-1',
  type: 'slider',
  slides: [],
})

const columnsSection = (elements: BuilderElement[]): BuilderSection => ({
  sectionId: 'section-1',
  type: 'columns',
  order: 0,
  settings: {},
  content: { columns: [{ id: 'column-1', elements }] },
})

describe('isEmptyHtml', () => {
  it('treats undefined and blank strings as empty', () => {
    expect(isEmptyHtml(undefined)).toBe(true)
    expect(isEmptyHtml('')).toBe(true)
  })

  it('treats TipTap empty-paragraph markup as empty', () => {
    expect(isEmptyHtml('<p></p>')).toBe(true)
  })

  it('treats markup with real text as filled', () => {
    expect(isEmptyHtml('<p>Hola</p>')).toBe(false)
  })
})

describe('isLocalizedFilled', () => {
  it('uses isEmptyHtml for kind "html"', () => {
    expect(isLocalizedFilled('<p></p>', 'html')).toBe(false)
    expect(isLocalizedFilled('<p>Hola</p>', 'html')).toBe(true)
  })

  it('uses a plain trim for kind "text"', () => {
    expect(isLocalizedFilled('   ', 'text')).toBe(false)
    expect(isLocalizedFilled('Logo', 'text')).toBe(true)
  })
})

describe('computeTranslationProgress', () => {
  it('returns 100% for every language when there is nothing to translate yet', () => {
    const progress = computeTranslationProgress([], LANGS)
    expect(progress.es).toEqual({ filled: 0, total: 0 })
    expect(progress.en).toEqual({ filled: 0, total: 0 })
  })

  it('counts text html and image alt per language, ignoring sliders', () => {
    const sections = [columnsSection([textElement('Hola', ''), imageElement('Perro', ''), sliderElement()])]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 2, total: 2 })
    expect(progress.en).toEqual({ filled: 0, total: 2 })
  })

  it('treats a TipTap empty paragraph as untranslated', () => {
    const sections = [columnsSection([textElement('<p>Hola</p>', '<p></p>')])]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.en).toEqual({ filled: 0, total: 1 })
  })

  it('ignores sections that are not the columns type', () => {
    const sections: BuilderSection[] = [
      { sectionId: 'hero-1', type: 'hero', order: 0, settings: {}, content: {} },
    ]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 0, total: 0 })
  })
})
