import { describe, it, expect } from 'vitest'
import {
  BUILDER_GRID_COLUMNS,
  BUILDER_LAYOUT_PRESETS,
  symmetricSpan,
  columnSpan,
  sectionSpans,
  setColumnSpans,
  setSectionColumns,
  createColumnsSection,
  normalizeSections,
} from './page.builder'
import type {
  BuilderColumn,
  BuilderColumnSpan,
  BuilderColumnsCount,
  BuilderSection,
} from './page.types'

const col = (id: string, span?: BuilderColumnSpan): BuilderColumn => ({
  id,
  elements: [],
  ...(span ? { span } : {}),
})

const columnsSection = (
  columns: BuilderColumn[],
  count: BuilderColumnsCount
): BuilderSection => ({
  sectionId: 's1',
  type: 'columns',
  order: 0,
  settings: { columns: count },
  content: { columns },
})

describe('symmetricSpan / columnSpan / sectionSpans', () => {
  it('maps each symmetric count to an exact integer span of 12', () => {
    expect(symmetricSpan(1)).toBe(12)
    expect(symmetricSpan(2)).toBe(6)
    expect(symmetricSpan(3)).toBe(4)
    expect(symmetricSpan(4)).toBe(3)
  })

  it('columnSpan falls back to symmetric when no explicit span', () => {
    expect(columnSpan(col('a'), 2)).toBe(6)
    expect(columnSpan(col('a', 8), 2)).toBe(8)
  })

  it('sectionSpans returns symmetric spans for an untouched section', () => {
    expect(sectionSpans(columnsSection([col('a'), col('b')], 2))).toEqual([
      6, 6,
    ])
  })

  it('sectionSpans returns explicit spans when present', () => {
    expect(sectionSpans(columnsSection([col('a', 8), col('b', 4)], 2))).toEqual(
      [8, 4]
    )
  })
})

describe('BUILDER_LAYOUT_PRESETS', () => {
  it('every preset sums to 12 and has the right column count', () => {
    for (const countKey of Object.keys(BUILDER_LAYOUT_PRESETS)) {
      const count = Number(countKey) as BuilderColumnsCount
      for (const preset of BUILDER_LAYOUT_PRESETS[count]) {
        expect(preset).toHaveLength(count)
        expect(preset.reduce((a, b) => a + b, 0)).toBe(BUILDER_GRID_COLUMNS)
      }
    }
  })

  it('offers the symmetric layout as the first option for 2 and 3 columns', () => {
    expect(BUILDER_LAYOUT_PRESETS[2][0]).toEqual([6, 6])
    expect(BUILDER_LAYOUT_PRESETS[3][0]).toEqual([4, 4, 4])
  })
})

describe('setColumnSpans', () => {
  it('applies a valid preset to the columns', () => {
    const sections = [columnsSection([col('a'), col('b')], 2)]
    const next = setColumnSpans(sections, 's1', [8, 4])
    expect(next[0].content.columns?.map((c) => c.span)).toEqual([8, 4])
  })

  it('ignores a preset whose length does not match the columns', () => {
    const sections = [columnsSection([col('a'), col('b')], 2)]
    const next = setColumnSpans(sections, 's1', [4, 4, 4])
    expect(next[0].content.columns?.every((c) => c.span === undefined)).toBe(
      true
    )
  })

  it('ignores a preset that does not sum to 12', () => {
    const sections = [columnsSection([col('a'), col('b')], 2)]
    const next = setColumnSpans(sections, 's1', [8, 8] as BuilderColumnSpan[])
    expect(next[0].content.columns?.every((c) => c.span === undefined)).toBe(
      true
    )
  })

  it('does not touch other sections', () => {
    const other = columnsSection([col('x'), col('y')], 2)
    other.sectionId = 's2'
    const next = setColumnSpans(
      [columnsSection([col('a'), col('b')], 2), other],
      's1',
      [8, 4]
    )
    expect(next[1]).toBe(other)
  })
})

describe('setSectionColumns resets spans', () => {
  it('drops explicit spans when the desktop column count changes', () => {
    const sections = [columnsSection([col('a', 8), col('b', 4)], 2)]
    const next = setSectionColumns(sections, 's1', 3)
    expect(next[0].content.columns?.every((c) => c.span === undefined)).toBe(
      true
    )
  })
})

describe('normalizeSections enforces the span invariant', () => {
  it('keeps explicit spans that sum to 12', () => {
    const raw = [
      {
        sectionId: 's1',
        type: 'columns',
        settings: { columns: 2 },
        content: { columns: [col('a', 8), col('b', 4)] },
      },
    ]
    expect(sectionSpans(normalizeSections(raw)[0])).toEqual([8, 4])
  })

  it('degrades to symmetric when spans do not sum to 12', () => {
    const raw = [
      {
        sectionId: 's1',
        type: 'columns',
        settings: { columns: 2 },
        content: { columns: [col('a', 8), col('b', 8)] },
      },
    ]
    const section = normalizeSections(raw)[0]
    expect(section.content.columns?.every((c) => c.span === undefined)).toBe(
      true
    )
    expect(sectionSpans(section)).toEqual([6, 6])
  })

  it('degrades to symmetric when only some columns carry a span', () => {
    const raw = [
      {
        sectionId: 's1',
        type: 'columns',
        settings: { columns: 2 },
        content: { columns: [col('a', 8), col('b')] },
      },
    ]
    expect(
      normalizeSections(raw)[0].content.columns?.every(
        (c) => c.span === undefined
      )
    ).toBe(true)
  })

  it('leaves a fully symmetric section without spans', () => {
    const section = createColumnsSection(2)
    const normalized = normalizeSections([section])[0]
    expect(normalized.content.columns?.every((c) => c.span === undefined)).toBe(
      true
    )
  })
})
