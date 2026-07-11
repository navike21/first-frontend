import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundVideo,
  BackgroundVideoFile,
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

/** A diferencia de `clampColumns`, un valor ausente se queda ausente (sin
 * "sin definir" no hay override responsive: hereda el conteo de escritorio). */
function clampOptionalColumns(value: unknown, max: BuilderColumnsCount): BuilderColumnsCount | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  return Math.min(max, Math.max(1, Math.round(value))) as BuilderColumnsCount
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
        section.settings = {
          ...settings,
          columns: count,
          tabletColumns: clampOptionalColumns(settings.tabletColumns, count),
          mobileColumns: clampOptionalColumns(settings.mobileColumns, count),
          hiddenOnTablet: !!settings.hiddenOnTablet,
          hiddenOnMobile: !!settings.hiddenOnMobile,
        }
        section.content = { ...content, columns: reconcileColumns(columnsRaw.map(normalizeColumn), count) }
      }
      return section
    })
}

/** Sin `columns`, la sección nace "pendiente de elegir" (settings.columns
 * queda undefined): así el estado de "todavía sin confirmar" vive en la
 * propia sección, no en un id externo que solo puede rastrear una a la vez
 * (crear una segunda sección pendiente no debe finalizar la primera). */
export function createColumnsSection(columns?: BuilderColumnsCount): BuilderSection {
  return {
    sectionId: newId(),
    type: 'columns',
    order: 0,
    settings: columns === undefined ? {} : { columns },
    content: {
      columns: columns === undefined ? [] : Array.from({ length: columns }, () => ({ id: newId(), elements: [] })),
    },
  }
}

export function isPendingColumnsChoice(section: BuilderSection): boolean {
  return isColumnsSection(section) && section.settings.columns === undefined
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

/** Inserta una sección nueva en `index` (clamp a los límites del array); sin
 * índice, o fuera de rango, se añade al final. Usado tanto por "clic para
 * añadir" (siempre al final) como por soltar la paleta sobre/entre secciones. */
export function insertSection(sections: BuilderSection[], section: BuilderSection, index?: number): BuilderSection[] {
  const at = index === undefined ? sections.length : Math.max(0, Math.min(index, sections.length))
  const next = [...sections]
  next.splice(at, 0, section)
  return next
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
    const settings = {
      ...s.settings,
      columns: count,
      // Si el conteo de escritorio baja, un override responsive por encima
      // del nuevo máximo dejaría de tener sentido (más columnas en tablet/
      // móvil que en escritorio).
      tabletColumns: clampOptionalColumns(s.settings.tabletColumns, count),
      mobileColumns: clampOptionalColumns(s.settings.mobileColumns, count),
    }
    return { ...s, settings, content: { ...s.content, columns } }
  })
}

export interface ResponsiveSectionSettings {
  tabletColumns?: BuilderColumnsCount
  mobileColumns?: BuilderColumnsCount
  hiddenOnTablet?: boolean
  hiddenOnMobile?: boolean
}

export function setResponsiveSettings(
  sections: BuilderSection[],
  sectionId: string,
  patch: ResponsiveSectionSettings,
): BuilderSection[] {
  return sections.map((s) =>
    s.sectionId === sectionId ? { ...s, settings: { ...s.settings, ...patch } } : s,
  )
}

/** Sin config para ese breakpoint, se ve como "ninguno" (no hereda de otro
 * breakpoint). */
export function getSectionBackground(section: BuilderSection, breakpoint: BackgroundBreakpoint): BackgroundConfig {
  return section.settings.background?.[breakpoint] ?? { type: 'none' }
}

/** Reemplazo completo de la config de un breakpoint (los demás no se tocan). */
export function setSectionBackground(
  sections: BuilderSection[],
  sectionId: string,
  breakpoint: BackgroundBreakpoint,
  config: BackgroundConfig,
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId) return s
    return {
      ...s,
      settings: {
        ...s.settings,
        background: { ...s.settings.background, [breakpoint]: config },
      },
    }
  })
}

/** Reemplaza solo la URL de un fondo de imagen (preview optimista o subida
 * real), preservando el resto de su configuración (posición, fullScreen,
 * parallax). No hace nada si el breakpoint cambió de tipo mientras la
 * subida estaba en curso. */
export function setBackgroundImageUrl(
  sections: BuilderSection[],
  sectionId: string,
  breakpoint: BackgroundBreakpoint,
  url: string,
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId) return s
    const current = s.settings.background?.[breakpoint]
    if (current?.type !== 'image') return s
    return {
      ...s,
      settings: {
        ...s.settings,
        background: { ...s.settings.background, [breakpoint]: { ...current, url } },
      },
    }
  })
}

/** Aplicado tras subir o elegir de la biblioteca: reemplaza el archivo del
 * mismo formato (mp4/webm) si ya existía, o lo agrega (máx 2). */
export function setBackgroundVideoFile(
  sections: BuilderSection[],
  sectionId: string,
  breakpoint: BackgroundBreakpoint,
  file: BackgroundVideoFile,
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId) return s
    const current = s.settings.background?.[breakpoint]
    const base: BackgroundVideo =
      current?.type === 'video' ? current : { type: 'video', sourceKind: 'upload', files: [], parallax: false }
    const files = [...base.files.filter((f) => f.mimeType !== file.mimeType), file].slice(0, 2)
    return {
      ...s,
      settings: {
        ...s.settings,
        background: { ...s.settings.background, [breakpoint]: { ...base, files } },
      },
    }
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
