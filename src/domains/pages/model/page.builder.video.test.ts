import { describe, it, expect } from 'vitest'
import {
  createVideoElement,
  setVideoFile,
  normalizeSections,
} from './page.builder'
import type { BuilderSection, BuilderVideoElement } from './page.types'

const videoSection = (video: Partial<BuilderVideoElement>): BuilderSection => ({
  sectionId: 's1',
  type: 'columns',
  order: 0,
  settings: { columns: 1 },
  content: {
    columns: [
      {
        id: 'col-1',
        elements: [
          {
            id: 'v1',
            type: 'video',
            sourceKind: 'embed',
            url: '',
            caption: {},
            ...video,
          } as BuilderVideoElement,
        ],
      },
    ],
  },
})

const videoOf = (sections: BuilderSection[]) =>
  sections[0].content.columns![0].elements[0] as BuilderVideoElement

describe('createVideoElement', () => {
  it('starts as an empty embed source', () => {
    const el = createVideoElement()
    expect(el.sourceKind).toBe('embed')
    expect(el.url).toBe('')
    expect(el.fileUrl).toBeUndefined()
  })
})

describe('setVideoFile', () => {
  it('sets fileUrl + posterUrl and flips sourceKind to upload', () => {
    const sections = [
      videoSection({ sourceKind: 'embed', url: 'https://youtu.be/x' }),
    ]
    const next = setVideoFile(
      sections,
      'v1',
      'https://cdn.example.com/v.mp4',
      'https://cdn.example.com/p.jpg'
    )
    const v = videoOf(next)
    expect(v.sourceKind).toBe('upload')
    expect(v.fileUrl).toBe('https://cdn.example.com/v.mp4')
    expect(v.posterUrl).toBe('https://cdn.example.com/p.jpg')
  })

  it('works without a poster', () => {
    const sections = [videoSection({})]
    const v = videoOf(
      setVideoFile(sections, 'v1', 'https://cdn.example.com/v.mp4')
    )
    expect(v.fileUrl).toBe('https://cdn.example.com/v.mp4')
    expect(v.posterUrl).toBeUndefined()
  })

  it('leaves other elements untouched', () => {
    const sections = [videoSection({})]
    const next = setVideoFile(
      sections,
      'other-id',
      'https://cdn.example.com/v.mp4'
    )
    expect(videoOf(next).fileUrl).toBeUndefined()
  })
})

describe('normalizeSections (video)', () => {
  it('defaults a legacy video (only url, no sourceKind) to embed', () => {
    const raw = [
      {
        sectionId: 's1',
        type: 'columns',
        settings: { columns: 1 },
        content: {
          columns: [
            {
              id: 'col-1',
              elements: [
                { id: 'v1', type: 'video', url: 'https://youtu.be/x' },
              ],
            },
          ],
        },
      },
    ]
    const v = videoOf(normalizeSections(raw))
    expect(v.sourceKind).toBe('embed')
    expect(v.url).toBe('https://youtu.be/x')
  })

  it('preserves an uploaded video with fileUrl/posterUrl', () => {
    const raw = [
      {
        sectionId: 's1',
        type: 'columns',
        settings: { columns: 1 },
        content: {
          columns: [
            {
              id: 'col-1',
              elements: [
                {
                  id: 'v1',
                  type: 'video',
                  sourceKind: 'upload',
                  url: '',
                  fileUrl: 'https://cdn.example.com/v.mp4',
                  posterUrl: 'https://cdn.example.com/p.jpg',
                },
              ],
            },
          ],
        },
      },
    ]
    const v = videoOf(normalizeSections(raw))
    expect(v.sourceKind).toBe('upload')
    expect(v.fileUrl).toBe('https://cdn.example.com/v.mp4')
    expect(v.posterUrl).toBe('https://cdn.example.com/p.jpg')
  })
})
