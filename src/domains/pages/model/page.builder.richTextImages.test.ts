import { describe, it, expect, vi } from 'vitest'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import {
  createColumnsSection,
  createTextElement,
  createAccordionElement,
  createButtonElement,
  addElement,
  updateElement,
  resolveSectionsRichTextImages,
} from './page.builder'
import type { BuilderAccordionElement } from './page.types'

const withOnlyPrimaryLang = (text: string) =>
  Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l, i) => [l, i === 0 ? text : ''])
  ) as Record<(typeof SUPPORTED_LANGUAGES)[number], string>

describe('resolveSectionsRichTextImages', () => {
  it('resolves embedded base64 images in a text element body', async () => {
    let section = createColumnsSection(1)
    const columnId = section.content.columns![0].id
    section = addElement(
      [section],
      section.sectionId,
      columnId,
      createTextElement()
    )[0]
    const elementId = section.content.columns![0].elements[0].id
    section = updateElement([section], section.sectionId, columnId, elementId, {
      html: withOnlyPrimaryLang(
        '<p>before</p><img src="data:image/png;base64,abc"><p>after</p>'
      ),
    })[0]

    const resolve = vi.fn(async (html: string) =>
      html.replace(
        /data:image\/png;base64,abc/,
        'https://cdn.example.com/real.png'
      )
    )
    const [resolved] = await resolveSectionsRichTextImages([section], resolve)

    const html = resolved.content.columns![0].elements[0]
    expect(html.type).toBe('text')
    expect(
      (html as { html: Record<string, string> }).html[SUPPORTED_LANGUAGES[0]]
    ).toContain('https://cdn.example.com/real.png')
    expect(resolve).toHaveBeenCalled()
  })

  it('resolves embedded base64 images in an accordion answer, leaving question untouched', async () => {
    let section = createColumnsSection(1)
    const columnId = section.content.columns![0].id
    section = addElement(
      [section],
      section.sectionId,
      columnId,
      createAccordionElement()
    )[0]
    const elementId = section.content.columns![0].elements[0].id

    const item = {
      id: 'item-1',
      question: withOnlyPrimaryLang('What?'),
      answer: withOnlyPrimaryLang(
        '<p><img src="data:image/png;base64,xyz"></p>'
      ),
    }
    section = updateElement([section], section.sectionId, columnId, elementId, {
      items: [item],
    })[0]

    const resolve = vi.fn(async (html: string) =>
      html.replace(
        /data:image\/png;base64,xyz/,
        'https://cdn.example.com/real2.png'
      )
    )
    const [resolved] = await resolveSectionsRichTextImages([section], resolve)

    const el = resolved.content.columns![0]
      .elements[0] as BuilderAccordionElement
    expect(el.items[0].answer[SUPPORTED_LANGUAGES[0]]).toContain(
      'https://cdn.example.com/real2.png'
    )
    expect(el.items[0].question[SUPPORTED_LANGUAGES[0]]).toBe('What?')
  })

  it('leaves non text/accordion elements untouched and never calls resolve for them', async () => {
    let section = createColumnsSection(1)
    const columnId = section.content.columns![0].id
    section = addElement(
      [section],
      section.sectionId,
      columnId,
      createButtonElement()
    )[0]

    const resolve = vi.fn(async (html: string) => html)
    const [resolved] = await resolveSectionsRichTextImages([section], resolve)
    expect(resolved).toEqual(section)
    expect(resolve).not.toHaveBeenCalled()
  })
})
