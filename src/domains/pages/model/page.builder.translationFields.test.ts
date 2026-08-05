import { describe, it, expect } from 'vitest'
import { extractTranslatableFields, applyTranslatedFields } from './page.builder'
import type {
  BuilderAccordionElement,
  BuilderButtonElement,
  BuilderColumn,
  BuilderGalleryElement,
  BuilderImageElement,
  BuilderMapElement,
  BuilderSection,
  BuilderSliderElement,
  BuilderStatsElement,
  BuilderTestimonialsElement,
  BuilderTextElement,
  BuilderVideoElement,
} from './page.types'

const section = (columns: BuilderColumn[]): BuilderSection => ({
  sectionId: 's1',
  type: 'columns',
  order: 0,
  settings: { columns: columns.length as 1 | 2 | 3 | 4 },
  content: { columns },
})

const column = (id: string, elements: BuilderColumn['elements']): BuilderColumn => ({
  id,
  elements,
})

describe('extractTranslatableFields', () => {
  it('returns an empty object for a page with no sections', () => {
    expect(extractTranslatableFields([], 'en')).toEqual({})
  })

  it('skips a section that has not chosen its columns yet (no content.columns)', () => {
    const pending: BuilderSection = {
      sectionId: 's1',
      type: 'columns',
      order: 0,
      settings: {},
      content: {},
    }
    expect(extractTranslatableFields([pending], 'en')).toEqual({})
  })

  it('extracts single-field elements (text/image/button/video/map) keyed by elementId', () => {
    const text = {
      id: 'el1',
      type: 'text',
      html: { en: '<p>Hi</p>' },
    } as BuilderTextElement
    const image = {
      id: 'el2',
      type: 'image',
      url: 'https://x/img.jpg',
      alt: { en: 'A photo' },
      width: '',
      height: '',
      align: 'center',
    } as BuilderImageElement
    const button = {
      id: 'el3',
      type: 'button',
      label: { en: 'Click me' },
      url: 'https://x',
      variant: 'primary',
      target: '_self',
      align: 'center',
    } as BuilderButtonElement
    const video = {
      id: 'el4',
      type: 'video',
      sourceKind: 'embed',
      url: 'https://x',
      caption: { en: 'A video' },
    } as BuilderVideoElement
    const map = {
      id: 'el5',
      type: 'map',
      address: '123 St',
      caption: { en: 'Our office' },
      showDirectionsButtons: true,
    } as BuilderMapElement

    const fields = extractTranslatableFields(
      [section([column('c1', [text, image, button, video, map])])],
      'en'
    )

    expect(fields).toEqual({
      el1: '<p>Hi</p>',
      el2: 'A photo',
      el3: 'Click me',
      el4: 'A video',
      el5: 'Our office',
    })
  })

  it('skips slider (no translatable text)', () => {
    const slider = {
      id: 'el1',
      type: 'slider',
      slides: [{ url: 'https://x/1.jpg', kind: 'image' }],
    } as BuilderSliderElement
    expect(
      extractTranslatableFields([section([column('c1', [slider])])], 'en')
    ).toEqual({})
  })

  it('excludes fields that are empty in the source language', () => {
    const text = { id: 'el1', type: 'text', html: { en: '' } } as BuilderTextElement
    expect(
      extractTranslatableFields([section([column('c1', [text])])], 'en')
    ).toEqual({})
  })

  it('extracts accordion/testimonials/stats items keyed by elementId:itemId:field, excluding name/value', () => {
    const accordion = {
      id: 'acc',
      type: 'accordion',
      items: [
        { id: 'it1', question: { en: 'What?' }, answer: { en: '<p>This.</p>' } },
      ],
    } as BuilderAccordionElement
    const testimonials = {
      id: 'test',
      type: 'testimonials',
      items: [
        {
          id: 'it2',
          name: 'Jane Doe',
          role: { en: 'CEO' },
          quote: { en: 'Great!' },
          rating: 5,
        },
      ],
    } as BuilderTestimonialsElement
    const stats = {
      id: 'stat',
      type: 'stats',
      items: [{ id: 'it3', value: '500+', label: { en: 'Clients' } }],
    } as BuilderStatsElement

    const fields = extractTranslatableFields(
      [section([column('c1', [accordion, testimonials, stats])])],
      'en'
    )

    expect(fields).toEqual({
      'acc:it1:question': 'What?',
      'acc:it1:answer': '<p>This.</p>',
      'test:it2:role': 'CEO',
      'test:it2:quote': 'Great!',
      'stat:it3:label': 'Clients',
    })
  })

  it('extracts gallery image alt text keyed by elementId:index:alt (no stable id per image)', () => {
    const gallery = {
      id: 'gal',
      type: 'gallery',
      columns: 2,
      images: [
        { url: 'https://x/1.jpg', alt: { en: 'First' } },
        { url: 'https://x/2.jpg', alt: { en: 'Second' } },
      ],
    } as BuilderGalleryElement
    const fields = extractTranslatableFields(
      [section([column('c1', [gallery])])],
      'en'
    )
    expect(fields).toEqual({ 'gal:0:alt': 'First', 'gal:1:alt': 'Second' })
  })
})

describe('applyTranslatedFields', () => {
  it('applies a translated value only to the target language slot, leaving other languages untouched', () => {
    const text = {
      id: 'el1',
      type: 'text',
      html: { en: '<p>Hi</p>', es: '<p>Hola</p>' },
    } as BuilderTextElement
    const next = applyTranslatedFields(
      [section([column('c1', [text])])],
      'de',
      { el1: '<p>Hallo</p>' }
    )
    const applied = next[0].content.columns![0].elements[0] as BuilderTextElement
    expect(applied.html).toEqual({
      en: '<p>Hi</p>',
      es: '<p>Hola</p>',
      de: '<p>Hallo</p>',
    })
  })

  it('leaves a field untouched when its key is absent from the result', () => {
    const button = {
      id: 'el1',
      type: 'button',
      label: { en: 'Click me' },
      url: 'https://x',
      variant: 'primary',
      target: '_self',
      align: 'center',
    } as BuilderButtonElement
    const next = applyTranslatedFields(
      [section([column('c1', [button])])],
      'de',
      {}
    )
    const applied = next[0].content.columns![0].elements[0] as BuilderButtonElement
    expect(applied.label).toEqual({ en: 'Click me' })
  })

  it('applies translated values back into the correct accordion/testimonials/stats items by id, never touching name/value', () => {
    const accordion = {
      id: 'acc',
      type: 'accordion',
      items: [{ id: 'it1', question: { en: 'What?' }, answer: { en: 'This.' } }],
    } as BuilderAccordionElement
    const testimonials = {
      id: 'test',
      type: 'testimonials',
      items: [
        { id: 'it2', name: 'Jane Doe', role: { en: 'CEO' }, quote: { en: 'Great!' } },
      ],
    } as BuilderTestimonialsElement
    const stats = {
      id: 'stat',
      type: 'stats',
      items: [{ id: 'it3', value: '500+', label: { en: 'Clients' } }],
    } as BuilderStatsElement

    const next = applyTranslatedFields(
      [section([column('c1', [accordion, testimonials, stats])])],
      'de',
      {
        'acc:it1:question': 'Was?',
        'acc:it1:answer': 'Das.',
        'test:it2:role': 'Geschäftsführerin',
        'test:it2:quote': 'Großartig!',
        'stat:it3:label': 'Kunden',
      }
    )

    const [appliedAccordion, appliedTestimonials, appliedStats] = next[0].content
      .columns![0].elements as [
      BuilderAccordionElement,
      BuilderTestimonialsElement,
      BuilderStatsElement,
    ]

    expect(appliedAccordion.items[0].question.de).toBe('Was?')
    expect(appliedAccordion.items[0].answer.de).toBe('Das.')
    expect(appliedTestimonials.items[0].role.de).toBe('Geschäftsführerin')
    expect(appliedTestimonials.items[0].quote.de).toBe('Großartig!')
    expect(appliedTestimonials.items[0].name).toBe('Jane Doe')
    expect(appliedStats.items[0].label.de).toBe('Kunden')
    expect(appliedStats.items[0].value).toBe('500+')
  })

  it('applies gallery image alt text back by index', () => {
    const gallery = {
      id: 'gal',
      type: 'gallery',
      columns: 2,
      images: [
        { url: 'https://x/1.jpg', alt: { en: 'First' } },
        { url: 'https://x/2.jpg', alt: { en: 'Second' } },
      ],
    } as BuilderGalleryElement
    const next = applyTranslatedFields(
      [section([column('c1', [gallery])])],
      'de',
      { 'gal:0:alt': 'Erste', 'gal:1:alt': 'Zweite' }
    )
    const applied = next[0].content.columns![0].elements[0] as BuilderGalleryElement
    expect(applied.images[0].alt.de).toBe('Erste')
    expect(applied.images[1].alt.de).toBe('Zweite')
  })

  it('round-trips extractTranslatableFields -> applyTranslatedFields for a mixed page', () => {
    const text = {
      id: 'el1',
      type: 'text',
      html: { en: '<p>Hi</p>' },
    } as BuilderTextElement
    const fields = extractTranslatableFields(
      [section([column('c1', [text])])],
      'en'
    )
    const translated = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, `translated:${v}`])
    )
    const next = applyTranslatedFields(
      [section([column('c1', [text])])],
      'de',
      translated
    )
    const applied = next[0].content.columns![0].elements[0] as BuilderTextElement
    expect(applied.html.de).toBe('translated:<p>Hi</p>')
    expect(applied.html.en).toBe('<p>Hi</p>')
  })
})
