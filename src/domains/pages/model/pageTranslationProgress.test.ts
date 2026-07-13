import { describe, it, expect } from 'vitest'
import type { Language } from '@/shared/i18n'
import type {
  BuilderSection,
  BuilderElement,
  BuilderTextElement,
  BuilderImageElement,
  BuilderSliderElement,
  BuilderButtonElement,
  BuilderGalleryElement,
  BuilderAccordionElement,
  BuilderTestimonialsElement,
  BuilderStatsElement,
  BuilderVideoElement,
  BuilderMapElement,
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

const buttonElement = (es?: string, en?: string): BuilderButtonElement => ({
  id: 'button-1',
  type: 'button',
  label: localized(es, en),
  url: 'https://example.com',
  variant: 'primary',
  target: '_self',
  align: 'center',
})

const galleryElement = (images: { url: string; es?: string; en?: string }[]): BuilderGalleryElement => ({
  id: 'gallery-1',
  type: 'gallery',
  columns: 3,
  images: images.map((i) => ({ url: i.url, alt: localized(i.es, i.en) })),
})

const accordionElement = (
  items: { qEs?: string; qEn?: string; aEs?: string; aEn?: string }[],
): BuilderAccordionElement => ({
  id: 'accordion-1',
  type: 'accordion',
  items: items.map((i, idx) => ({
    id: `item-${idx}`,
    question: localized(i.qEs, i.qEn),
    answer: localized(i.aEs, i.aEn),
  })),
})

const testimonialsElement = (
  items: { name?: string; roleEs?: string; roleEn?: string; quoteEs?: string; quoteEn?: string }[],
): BuilderTestimonialsElement => ({
  id: 'testimonials-1',
  type: 'testimonials',
  items: items.map((i, idx) => ({
    id: `item-${idx}`,
    name: i.name ?? '',
    role: localized(i.roleEs, i.roleEn),
    quote: localized(i.quoteEs, i.quoteEn),
  })),
})

const statsElement = (items: { value?: string; es?: string; en?: string }[]): BuilderStatsElement => ({
  id: 'stats-1',
  type: 'stats',
  items: items.map((i, idx) => ({ id: `item-${idx}`, value: i.value ?? '', label: localized(i.es, i.en) })),
})

const videoElement = (es?: string, en?: string): BuilderVideoElement => ({
  id: 'video-1',
  type: 'video',
  url: 'https://youtube.com/watch?v=x',
  caption: localized(es, en),
})

const mapElement = (es?: string, en?: string): BuilderMapElement => ({
  id: 'map-1',
  type: 'map',
  address: 'Av. Principal 123',
  caption: localized(es, en),
  showDirectionsButtons: false,
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

  it('counts a button label the same as a single localized field', () => {
    const sections = [columnsSection([buttonElement('Comprar', '')])]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 1, total: 1 })
    expect(progress.en).toEqual({ filled: 0, total: 1 })
  })

  it('scales gallery total with the number of images, not a flat 1', () => {
    const sections = [
      columnsSection([
        galleryElement([
          { url: 'a.jpg', es: 'Perro', en: 'Dog' },
          { url: 'b.jpg', es: 'Gato', en: '' },
        ]),
      ]),
    ]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 2, total: 2 })
    expect(progress.en).toEqual({ filled: 1, total: 2 })
  })

  it('counts 2 fields per accordion item per language', () => {
    const sections = [
      columnsSection([accordionElement([{ qEs: '¿Precio?', aEs: '<p>10 soles</p>', qEn: '', aEn: '<p></p>' }])]),
    ]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 2, total: 2 })
    expect(progress.en).toEqual({ filled: 0, total: 2 })
  })

  it('counts role+quote per testimonial item, ignoring name/avatar/rating', () => {
    const sections = [
      columnsSection([
        testimonialsElement([{ name: 'Ana', roleEs: 'Gerenta', roleEn: '', quoteEs: 'Excelente', quoteEn: '' }]),
      ]),
    ]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 2, total: 2 })
    expect(progress.en).toEqual({ filled: 0, total: 2 })
  })

  it('counts only label per stats item, ignoring value', () => {
    const sections = [
      columnsSection([
        statsElement([
          { value: '500+', es: 'Clientes', en: 'Customers' },
          { value: '98%', es: 'Satisfacción', en: '' },
        ]),
      ]),
    ]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 2, total: 2 })
    expect(progress.en).toEqual({ filled: 1, total: 2 })
  })

  it('counts only caption for video, ignoring url', () => {
    const sections = [columnsSection([videoElement('Descripción', '')])]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 1, total: 1 })
    expect(progress.en).toEqual({ filled: 0, total: 1 })
  })

  it('counts only caption for map, ignoring address/lat/lng', () => {
    const sections = [columnsSection([mapElement('Nuestra tienda', '')])]
    const progress = computeTranslationProgress(sections, LANGS)
    expect(progress.es).toEqual({ filled: 1, total: 1 })
    expect(progress.en).toEqual({ filled: 0, total: 1 })
  })
})
