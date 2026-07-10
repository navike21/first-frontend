import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type {
  BuilderColumn,
  BuilderColumnsCount,
  BuilderElement,
  BuilderImageElement,
  BuilderSection,
  BuilderTextElement,
  PageLocalizedString,
} from './page.types'

export const MAX_BUILDER_COLUMNS = 4

const newId = (): string => crypto.randomUUID()

function emptyLocalized(): PageLocalizedString {
  return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as PageLocalizedString
}

function normalizeLocalized(input: unknown): PageLocalizedString {
  const base = emptyLocalized()
  if (input && typeof input === 'object') {
    for (const lang of SUPPORTED_LANGUAGES) {
      const value = (input as Record<string, unknown>)[lang]
      if (typeof value === 'string') base[lang] = value
    }
  }
  return base
}

export function isColumnsSection(section: BuilderSection): boolean {
  return section.type === 'columns'
}

export function clampColumns(count: unknown): BuilderColumnsCount {
  const n = typeof count === 'number' && Number.isFinite(count) ? Math.round(count) : 1
  return Math.min(MAX_BUILDER_COLUMNS, Math.max(1, n)) as BuilderColumnsCount
}

function normalizeElement(raw: unknown): BuilderElement | null {
  if (!raw || typeof raw !== 'object') return null
  const el = raw as Record<string, unknown>
  if (el.type === 'text') {
    const text: BuilderTextElement = {
      id: typeof el.id === 'string' ? el.id : newId(),
      type: 'text',
      html: normalizeLocalized(el.html),
    }
    return text
  }
  if (el.type === 'image') {
    const align = el.align === 'left' || el.align === 'right' ? el.align : 'center'
    const image: BuilderImageElement = {
      id: typeof el.id === 'string' ? el.id : newId(),
      type: 'image',
      url: typeof el.url === 'string' ? el.url : '',
      alt: normalizeLocalized(el.alt),
      width: typeof el.width === 'string' ? el.width : '',
      height: typeof el.height === 'string' ? el.height : '',
      align,
    }
    return image
  }
  return null
}

function normalizeColumn(raw: unknown): BuilderColumn {
  const col = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const elementsRaw = Array.isArray(col.elements) ? col.elements : []
  return {
    id: typeof col.id === 'string' ? col.id : newId(),
    elements: elementsRaw.map(normalizeElement).filter((e): e is BuilderElement => e !== null),
  }
}

/**
 * Reconcilia el array de columnas con el conteo configurado: rellena con
 * columnas vacías o, al reducir, mueve los elementos sobrantes a la última
 * columna restante (nunca se pierde contenido).
 */
export function reconcileColumns(columns: BuilderColumn[], count: BuilderColumnsCount): BuilderColumn[] {
  const next = columns.slice(0, count).map((c) => ({ ...c, elements: [...c.elements] }))
  while (next.length < count) next.push({ id: newId(), elements: [] })

  const overflow = columns.slice(count).flatMap((c) => c.elements)
  if (overflow.length > 0) {
    const last = next[next.length - 1]
    last.elements = [...last.elements, ...overflow]
  }
  return next
}

/**
 * Normaliza secciones venidas del backend (o de caché vieja): las de tipo
 * 'columns' se completan al contrato del builder; los demás tipos se
 * conservan intactos para no destruir datos que este editor aún no maneja.
 */
export function normalizeSections(input?: unknown): BuilderSection[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((raw): raw is Record<string, unknown> => !!raw && typeof raw === 'object')
    .map((raw, index) => {
      const settings =
        raw.settings && typeof raw.settings === 'object' ? { ...(raw.settings as Record<string, unknown>) } : {}
      const content =
        raw.content && typeof raw.content === 'object' ? { ...(raw.content as Record<string, unknown>) } : {}
      const section: BuilderSection = {
        sectionId: typeof raw.sectionId === 'string' ? raw.sectionId : newId(),
        type: typeof raw.type === 'string' ? raw.type : 'columns',
        order: index,
        settings,
        content,
      }
      if (section.type === 'columns') {
        const count = clampColumns(settings.columns)
        const columnsRaw = Array.isArray(content.columns) ? content.columns : []
        section.settings = { ...settings, columns: count }
        section.content = { ...content, columns: reconcileColumns(columnsRaw.map(normalizeColumn), count) }
      }
      return section
    })
}

export function createColumnsSection(columns: BuilderColumnsCount = 2): BuilderSection {
  return {
    sectionId: newId(),
    type: 'columns',
    order: 0,
    settings: { columns },
    content: { columns: Array.from({ length: columns }, () => ({ id: newId(), elements: [] })) },
  }
}

export function createTextElement(): BuilderTextElement {
  return { id: newId(), type: 'text', html: emptyLocalized() }
}

export function createImageElement(): BuilderImageElement {
  return { id: newId(), type: 'image', url: '', alt: emptyLocalized(), width: '', height: '', align: 'center' }
}

// ── Operaciones puras sobre el draft (siempre devuelven un array nuevo) ─────

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function moveSection(sections: BuilderSection[], activeId: string, overId: string): BuilderSection[] {
  const from = sections.findIndex((s) => s.sectionId === activeId)
  const to = sections.findIndex((s) => s.sectionId === overId)
  if (from < 0 || to < 0 || from === to) return sections
  return move(sections, from, to)
}

export function removeSection(sections: BuilderSection[], sectionId: string): BuilderSection[] {
  return sections.filter((s) => s.sectionId !== sectionId)
}

export function setSectionColumns(
  sections: BuilderSection[],
  sectionId: string,
  count: BuilderColumnsCount,
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId || !isColumnsSection(s)) return s
    const columns = reconcileColumns(s.content.columns ?? [], count)
    return { ...s, settings: { ...s.settings, columns: count }, content: { ...s.content, columns } }
  })
}

function mapColumn(
  sections: BuilderSection[],
  sectionId: string,
  columnId: string,
  fn: (column: BuilderColumn) => BuilderColumn,
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId || !isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => (c.id === columnId ? fn(c) : c))
    return { ...s, content: { ...s.content, columns } }
  })
}

export function addElement(
  sections: BuilderSection[],
  sectionId: string,
  columnId: string,
  element: BuilderElement,
): BuilderSection[] {
  return mapColumn(sections, sectionId, columnId, (c) => ({ ...c, elements: [...c.elements, element] }))
}

export function updateElement(
  sections: BuilderSection[],
  sectionId: string,
  columnId: string,
  elementId: string,
  patch: Partial<BuilderTextElement> | Partial<BuilderImageElement>,
): BuilderSection[] {
  return mapColumn(sections, sectionId, columnId, (c) => ({
    ...c,
    elements: c.elements.map((e) => (e.id === elementId ? ({ ...e, ...patch } as BuilderElement) : e)),
  }))
}

export function removeElement(
  sections: BuilderSection[],
  sectionId: string,
  columnId: string,
  elementId: string,
): BuilderSection[] {
  return mapColumn(sections, sectionId, columnId, (c) => ({
    ...c,
    elements: c.elements.filter((e) => e.id !== elementId),
  }))
}

export function moveElement(
  sections: BuilderSection[],
  sectionId: string,
  columnId: string,
  activeId: string,
  overId: string,
): BuilderSection[] {
  return mapColumn(sections, sectionId, columnId, (c) => {
    const from = c.elements.findIndex((e) => e.id === activeId)
    const to = c.elements.findIndex((e) => e.id === overId)
    if (from < 0 || to < 0 || from === to) return c
    return { ...c, elements: move(c.elements, from, to) }
  })
}

export interface ElementLocation {
  sectionId: string
  columnId: string
}

/**
 * Mueve un elemento a cualquier columna de cualquier sección: mismo destino
 * → reorden; destino distinto → se extrae y se inserta antes de
 * `overElementId` (o al final si la columna destino está vacía).
 */
export function moveElementAcross(
  sections: BuilderSection[],
  elementId: string,
  source: ElementLocation,
  target: ElementLocation,
  overElementId: string | null,
): BuilderSection[] {
  if (source.sectionId === target.sectionId && source.columnId === target.columnId) {
    return overElementId ? moveElement(sections, source.sectionId, source.columnId, elementId, overElementId) : sections
  }

  let moved: BuilderElement | undefined
  const without = mapColumn(sections, source.sectionId, source.columnId, (c) => {
    moved = c.elements.find((e) => e.id === elementId)
    return { ...c, elements: c.elements.filter((e) => e.id !== elementId) }
  })
  if (!moved) return sections

  return mapColumn(without, target.sectionId, target.columnId, (c) => {
    const elements = [...c.elements]
    const index = overElementId ? elements.findIndex((e) => e.id === overElementId) : -1
    if (index >= 0) elements.splice(index, 0, moved as BuilderElement)
    else elements.push(moved as BuilderElement)
    return { ...c, elements }
  })
}

/** Sustituye la URL de un elemento imagen (post-subida) esté donde esté. */
export function replaceImageUrl(sections: BuilderSection[], elementId: string, url: string): BuilderSection[] {
  return sections.map((s) => {
    if (!isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => ({
      ...c,
      elements: c.elements.map((e) => (e.id === elementId && e.type === 'image' ? { ...e, url } : e)),
    }))
    return { ...s, content: { ...s.content, columns } }
  })
}
