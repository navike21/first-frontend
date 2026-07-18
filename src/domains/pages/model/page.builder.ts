import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundVideo,
  BackgroundVideoFile,
  BuilderAccordionElement,
  BuilderAccordionItem,
  BuilderButtonElement,
  BuilderColumn,
  BuilderColumnSpan,
  BuilderColumnsCount,
  BuilderElement,
  BuilderElementPatch,
  BuilderGalleryElement,
  BuilderGalleryImage,
  BuilderImageElement,
  BuilderMapElement,
  BuilderSection,
  BuilderSliderElement,
  BuilderSliderSlide,
  BuilderStatItem,
  BuilderStatsElement,
  BuilderTestimonialItem,
  BuilderTestimonialRating,
  BuilderTestimonialsElement,
  BuilderTextElement,
  BuilderVideoElement,
  PageLocalizedString,
} from './page.types'

export const MAX_BUILDER_COLUMNS = 4

/** Grid del sitio público. 12 es divisible entre 1-4 (MAX_BUILDER_COLUMNS),
 * así que cada conteo simétrico tiene un span entero exacto (12/6/4/3). */
export const BUILDER_GRID_COLUMNS = 12

const newId = (): string => crypto.randomUUID()

/** Span de una columna cuando la sección es simétrica (sin spans explícitos). */
export function symmetricSpan(count: BuilderColumnsCount): BuilderColumnSpan {
  return (BUILDER_GRID_COLUMNS / count) as BuilderColumnSpan
}

function isValidSpan(value: unknown): value is BuilderColumnSpan {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= BUILDER_GRID_COLUMNS
}

/** Ancho efectivo de una columna: su span explícito, o el simétrico. */
export function columnSpan(column: BuilderColumn, count: BuilderColumnsCount): BuilderColumnSpan {
  return column.span ?? symmetricSpan(count)
}

/** Spans efectivos de una sección, en orden — para pintar el grid y para
 * resaltar el preset activo. */
export function sectionSpans(section: BuilderSection): BuilderColumnSpan[] {
  const columns = section.content.columns ?? []
  const count = clampColumns(section.settings.columns)
  return columns.map((c) => columnSpan(c, count))
}

/** Distribuciones ofrecidas en el constructor, por nº de columnas. Cada una
 * suma 12. Deliberadamente acotadas a los layouts reales de una web (no toda
 * combinación posible): con 1 y 4 columnas solo existe el simétrico. */
export const BUILDER_LAYOUT_PRESETS: Record<BuilderColumnsCount, BuilderColumnSpan[][]> = {
  1: [[12]],
  2: [
    [6, 6],
    [8, 4],
    [4, 8],
    [9, 3],
    [3, 9],
    [7, 5],
    [5, 7],
  ],
  3: [
    [4, 4, 4],
    [6, 3, 3],
    [3, 6, 3],
    [3, 3, 6],
  ],
  4: [[3, 3, 3, 3]],
}

/**
 * Aplica la invariante de spans: o todas las columnas lo llevan y suman 12,
 * o ninguna (simétrico). Cualquier otra combinación —dato viejo, edición a
 * mano, o una reconciliación que cambió el conteo— degrada a simétrico en
 * vez de romper, mismo criterio defensivo que el resto de `normalizeSections`.
 */
function normalizeColumnSpans(columns: BuilderColumn[]): BuilderColumn[] {
  const toSymmetric = () => columns.map((c) => ({ ...c, span: undefined }))
  if (columns.every((c) => c.span === undefined)) return columns
  if (!columns.every((c) => isValidSpan(c.span))) return toSymmetric()
  const total = columns.reduce((sum, c) => sum + (c.span ?? 0), 0)
  return total === BUILDER_GRID_COLUMNS ? columns : toSymmetric()
}

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

function normalizeTextElement(el: Record<string, unknown>): BuilderTextElement {
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'text',
    html: normalizeLocalized(el.html),
  }
}

function normalizeImageElement(el: Record<string, unknown>): BuilderImageElement {
  const align = el.align === 'left' || el.align === 'right' ? el.align : 'center'
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'image',
    url: typeof el.url === 'string' ? el.url : '',
    alt: normalizeLocalized(el.alt),
    width: typeof el.width === 'string' ? el.width : '',
    height: typeof el.height === 'string' ? el.height : '',
    align,
  }
}

function normalizeSliderSlide(raw: unknown): BuilderSliderSlide[] {
  if (!raw || typeof raw !== 'object') return []
  const slide = raw as Record<string, unknown>
  if (typeof slide.url !== 'string' || !slide.url) return []
  return [
    {
      url: slide.url,
      kind: slide.kind === 'video' ? 'video' : 'image',
      posterUrl: typeof slide.posterUrl === 'string' ? slide.posterUrl : undefined,
    },
  ]
}

function normalizeSliderElement(el: Record<string, unknown>): BuilderSliderElement {
  const rawSlides = Array.isArray(el.slides) ? el.slides : []
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'slider',
    slides: rawSlides.flatMap(normalizeSliderSlide),
  }
}

const BUTTON_VARIANTS: BuilderButtonElement['variant'][] = ['primary', 'secondary', 'outline']

function normalizeButtonElement(el: Record<string, unknown>): BuilderButtonElement {
  const align = el.align === 'left' || el.align === 'right' ? el.align : 'center'
  const variant = BUTTON_VARIANTS.includes(el.variant as BuilderButtonElement['variant'])
    ? (el.variant as BuilderButtonElement['variant'])
    : 'primary'
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'button',
    label: normalizeLocalized(el.label),
    url: typeof el.url === 'string' ? el.url : '',
    variant,
    target: el.target === '_blank' ? '_blank' : '_self',
    align,
  }
}

function normalizeGalleryImage(raw: unknown): BuilderGalleryImage[] {
  if (!raw || typeof raw !== 'object') return []
  const img = raw as Record<string, unknown>
  if (typeof img.url !== 'string' || !img.url) return []
  return [{ url: img.url, alt: normalizeLocalized(img.alt) }]
}

function normalizeGalleryElement(el: Record<string, unknown>): BuilderGalleryElement {
  const rawImages = Array.isArray(el.images) ? el.images : []
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'gallery',
    images: rawImages.flatMap(normalizeGalleryImage),
    columns: clampColumns(el.columns),
  }
}

function normalizeAccordionItem(raw: unknown): BuilderAccordionItem[] {
  if (!raw || typeof raw !== 'object') return []
  const item = raw as Record<string, unknown>
  return [
    {
      id: typeof item.id === 'string' ? item.id : newId(),
      question: normalizeLocalized(item.question),
      answer: normalizeLocalized(item.answer),
    },
  ]
}

function normalizeAccordionElement(el: Record<string, unknown>): BuilderAccordionElement {
  const rawItems = Array.isArray(el.items) ? el.items : []
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'accordion',
    items: rawItems.flatMap(normalizeAccordionItem),
  }
}

const TESTIMONIAL_RATING_VALUES: BuilderTestimonialRating[] = [1, 2, 3, 4, 5]

function normalizeTestimonialItem(raw: unknown): BuilderTestimonialItem[] {
  if (!raw || typeof raw !== 'object') return []
  const item = raw as Record<string, unknown>
  const rating = TESTIMONIAL_RATING_VALUES.includes(item.rating as BuilderTestimonialRating)
    ? (item.rating as BuilderTestimonialRating)
    : undefined
  return [
    {
      id: typeof item.id === 'string' ? item.id : newId(),
      name: typeof item.name === 'string' ? item.name : '',
      role: normalizeLocalized(item.role),
      avatarUrl: typeof item.avatarUrl === 'string' && item.avatarUrl ? item.avatarUrl : undefined,
      quote: normalizeLocalized(item.quote),
      rating,
    },
  ]
}

function normalizeTestimonialsElement(el: Record<string, unknown>): BuilderTestimonialsElement {
  const rawItems = Array.isArray(el.items) ? el.items : []
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'testimonials',
    items: rawItems.flatMap(normalizeTestimonialItem),
  }
}

function normalizeStatItem(raw: unknown): BuilderStatItem[] {
  if (!raw || typeof raw !== 'object') return []
  const item = raw as Record<string, unknown>
  return [
    {
      id: typeof item.id === 'string' ? item.id : newId(),
      value: typeof item.value === 'string' ? item.value : '',
      label: normalizeLocalized(item.label),
    },
  ]
}

function normalizeStatsElement(el: Record<string, unknown>): BuilderStatsElement {
  const rawItems = Array.isArray(el.items) ? el.items : []
  return { id: typeof el.id === 'string' ? el.id : newId(), type: 'stats', items: rawItems.flatMap(normalizeStatItem) }
}

function normalizeVideoElement(el: Record<string, unknown>): BuilderVideoElement {
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'video',
    sourceKind: el.sourceKind === 'upload' ? 'upload' : 'embed',
    url: typeof el.url === 'string' ? el.url : '',
    fileUrl: typeof el.fileUrl === 'string' && el.fileUrl ? el.fileUrl : undefined,
    posterUrl: typeof el.posterUrl === 'string' && el.posterUrl ? el.posterUrl : undefined,
    caption: normalizeLocalized(el.caption),
  }
}

function normalizeMapElement(el: Record<string, unknown>): BuilderMapElement {
  const lat = typeof el.lat === 'number' && Number.isFinite(el.lat) ? el.lat : undefined
  const lng = typeof el.lng === 'number' && Number.isFinite(el.lng) ? el.lng : undefined
  return {
    id: typeof el.id === 'string' ? el.id : newId(),
    type: 'map',
    address: typeof el.address === 'string' ? el.address : '',
    lat,
    lng,
    caption: normalizeLocalized(el.caption),
    showDirectionsButtons: !!el.showDirectionsButtons,
  }
}

function normalizeElement(raw: unknown): BuilderElement | null {
  if (!raw || typeof raw !== 'object') return null
  const el = raw as Record<string, unknown>
  if (el.type === 'text') return normalizeTextElement(el)
  if (el.type === 'image') return normalizeImageElement(el)
  if (el.type === 'slider') return normalizeSliderElement(el)
  if (el.type === 'button') return normalizeButtonElement(el)
  if (el.type === 'gallery') return normalizeGalleryElement(el)
  if (el.type === 'accordion') return normalizeAccordionElement(el)
  if (el.type === 'testimonials') return normalizeTestimonialsElement(el)
  if (el.type === 'stats') return normalizeStatsElement(el)
  if (el.type === 'video') return normalizeVideoElement(el)
  if (el.type === 'map') return normalizeMapElement(el)
  return null
}

function normalizeColumn(raw: unknown): BuilderColumn {
  const col = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const elementsRaw = Array.isArray(col.elements) ? col.elements : []
  return {
    id: typeof col.id === 'string' ? col.id : newId(),
    elements: elementsRaw.map(normalizeElement).filter((e): e is BuilderElement => e !== null),
    ...(isValidSpan(col.span) ? { span: col.span } : {}),
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
  // Al cambiar el conteo, los spans previos ya no pueden sumar 12 (y una
  // columna nueva no tendría cuál) — se vuelve a simétrico. Si el conteo no
  // cambió esto es un no-op, así que `normalizeSections` no pisa la
  // distribución guardada en cada carga.
  return columns.length === count ? next : next.map((c) => ({ ...c, span: undefined }))
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
        section.content = {
          ...content,
          columns: normalizeColumnSpans(reconcileColumns(columnsRaw.map(normalizeColumn), count)),
        }
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

export function createSliderElement(): BuilderSliderElement {
  return { id: newId(), type: 'slider', slides: [] }
}

export function createButtonElement(): BuilderButtonElement {
  return { id: newId(), type: 'button', label: emptyLocalized(), url: '', variant: 'primary', target: '_self', align: 'center' }
}

export function createGalleryElement(): BuilderGalleryElement {
  return { id: newId(), type: 'gallery', images: [], columns: 3 }
}

export function createAccordionElement(): BuilderAccordionElement {
  return { id: newId(), type: 'accordion', items: [] }
}

export function createTestimonialsElement(): BuilderTestimonialsElement {
  return { id: newId(), type: 'testimonials', items: [] }
}

export function createStatsElement(): BuilderStatsElement {
  return { id: newId(), type: 'stats', items: [] }
}

export function createVideoElement(): BuilderVideoElement {
  return { id: newId(), type: 'video', sourceKind: 'embed', url: '', caption: emptyLocalized() }
}

export function createMapElement(): BuilderMapElement {
  return { id: newId(), type: 'map', address: '', caption: emptyLocalized(), showDirectionsButtons: false }
}

/** Deep-link universal a Google Maps (no requiere API key) — usa lat/lng si
 * están disponibles, si no cae a la dirección de texto libre. */
export function buildGoogleMapsDirectionsUrl(address: string, lat?: number, lng?: number): string {
  const destination = lat !== undefined && lng !== undefined ? `${lat},${lng}` : address
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** Waze necesita lat/lng — no soporta destino por dirección de texto. */
export function buildWazeUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
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

/**
 * Aplica una distribución (preset) a las columnas de una sección: el span se
 * guarda EN cada columna, no en un array paralelo en `settings` — así viaja
 * con ella y `reconcileColumns`/reordenamientos no pueden desincronizarlo.
 * `spans` acá es solo la entrada posicional del preset elegido.
 *
 * Ignora un preset que no cuadre con las columnas actuales (otra longitud, o
 * que no sume 12): la invariante se mantiene en el dato, no en la confianza
 * sobre quien llama.
 */
export function setColumnSpans(
  sections: BuilderSection[],
  sectionId: string,
  spans: BuilderColumnSpan[],
): BuilderSection[] {
  return sections.map((s) => {
    if (s.sectionId !== sectionId || !isColumnsSection(s)) return s
    const columns = s.content.columns ?? []
    if (spans.length !== columns.length) return s
    if (spans.reduce((sum, n) => sum + n, 0) !== BUILDER_GRID_COLUMNS) return s
    return { ...s, content: { ...s.content, columns: columns.map((c, i) => ({ ...c, span: spans[i] })) } }
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
  patch: BuilderElementPatch,
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

/** Fija el archivo de video de un widget `video` (post-subida o elección de
 * galería) esté donde esté, marcándolo como `sourceKind: 'upload'`. `posterUrl`
 * puede venir de la miniatura de la biblioteca o de un frame capturado. */
export function setVideoFile(
  sections: BuilderSection[],
  elementId: string,
  fileUrl: string,
  posterUrl?: string,
): BuilderSection[] {
  return sections.map((s) => {
    if (!isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => ({
      ...c,
      elements: c.elements.map((e) =>
        e.id === elementId && e.type === 'video'
          ? { ...e, sourceKind: 'upload' as const, fileUrl, posterUrl }
          : e,
      ),
    }))
    return { ...s, content: { ...s.content, columns } }
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

function replaceSlideInElement(
  e: BuilderElement,
  elementId: string,
  oldUrl: string,
  newUrl: string,
  posterUrl?: string,
): BuilderElement {
  if (e.id !== elementId || e.type !== 'slider') return e
  const slides = e.slides.map((slide) =>
    slide.url === oldUrl ? { ...slide, url: newUrl, ...(posterUrl && { posterUrl }) } : slide,
  )
  return { ...e, slides }
}

/** Sustituye una diapositiva puntual de un slider (post-subida) por su URL
 * real, dondequiera que esté el elemento — el resto de las diapositivas no
 * se tocan. `posterUrl` (solo video) se agrega si ya se generó al momento de
 * guardar. */
export function replaceSliderSlideUrl(
  sections: BuilderSection[],
  elementId: string,
  oldUrl: string,
  newUrl: string,
  posterUrl?: string,
): BuilderSection[] {
  return sections.map((s) => {
    if (!isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => ({
      ...c,
      elements: c.elements.map((e) => replaceSlideInElement(e, elementId, oldUrl, newUrl, posterUrl)),
    }))
    return { ...s, content: { ...s.content, columns } }
  })
}

function replaceGalleryImageInElement(e: BuilderElement, elementId: string, oldUrl: string, newUrl: string): BuilderElement {
  if (e.id !== elementId || e.type !== 'gallery') return e
  return { ...e, images: e.images.map((img) => (img.url === oldUrl ? { ...img, url: newUrl } : img)) }
}

/** Sustituye la URL de una imagen puntual de la galería (post-subida) por su
 * URL real, dondequiera que esté el elemento — el resto de las imágenes no
 * se tocan. */
export function replaceGalleryImageUrl(
  sections: BuilderSection[],
  elementId: string,
  oldUrl: string,
  newUrl: string,
): BuilderSection[] {
  return sections.map((s) => {
    if (!isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => ({
      ...c,
      elements: c.elements.map((e) => replaceGalleryImageInElement(e, elementId, oldUrl, newUrl)),
    }))
    return { ...s, content: { ...s.content, columns } }
  })
}

function replaceTestimonialAvatarInElement(e: BuilderElement, elementId: string, oldUrl: string, newUrl: string): BuilderElement {
  if (e.id !== elementId || e.type !== 'testimonials') return e
  return { ...e, items: e.items.map((item) => (item.avatarUrl === oldUrl ? { ...item, avatarUrl: newUrl } : item)) }
}

/** Sustituye el avatar de un testimonio puntual (post-subida) por su URL
 * real — se busca por `avatarUrl === oldUrl` dentro de `items` (cada blob
 * URL de `URL.createObjectURL` es irrepetible, igual de único que un id). */
export function replaceTestimonialAvatarUrl(
  sections: BuilderSection[],
  elementId: string,
  oldUrl: string,
  newUrl: string,
): BuilderSection[] {
  return sections.map((s) => {
    if (!isColumnsSection(s)) return s
    const columns = (s.content.columns ?? []).map((c) => ({
      ...c,
      elements: c.elements.map((e) => replaceTestimonialAvatarInElement(e, elementId, oldUrl, newUrl)),
    }))
    return { ...s, content: { ...s.content, columns } }
  })
}

async function resolveLocalized(
  value: PageLocalizedString,
  resolve: (html: string) => Promise<string>,
): Promise<PageLocalizedString> {
  const next = { ...value }
  await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => {
      next[lang] = await resolve(value[lang] ?? '')
    }),
  )
  return next
}

/**
 * Sube a storage cualquier imagen embebida como base64 (`data:image/...`) en
 * los dos únicos campos rich-text del builder — el cuerpo de un elemento
 * `text` y la respuesta de un ítem de `accordion` — y la reemplaza por su URL
 * real, ANTES de guardar. RichTextArea inserta esas imágenes directo como
 * base64 (pegar/soltar/subir desde su propio toolbar, sin pasar por el resto
 * del flujo de subida diferida de este archivo); si no se resuelven acá, el
 * sanitizador HTML del backend las descarta en el guardado (no permite
 * esquema `data:`), perdiendo la imagen en silencio.
 */
export async function resolveSectionsRichTextImages(
  sections: BuilderSection[],
  resolve: (html: string) => Promise<string>,
): Promise<BuilderSection[]> {
  return Promise.all(
    sections.map(async (s) => {
      if (!isColumnsSection(s)) return s
      const columns = await Promise.all(
        (s.content.columns ?? []).map(async (c) => ({
          ...c,
          elements: await Promise.all(c.elements.map((e) => resolveElementRichTextImages(e, resolve))),
        })),
      )
      return { ...s, content: { ...s.content, columns } }
    }),
  )
}

async function resolveElementRichTextImages(
  element: BuilderElement,
  resolve: (html: string) => Promise<string>,
): Promise<BuilderElement> {
  if (element.type === 'text') {
    return { ...element, html: await resolveLocalized(element.html, resolve) }
  }
  if (element.type === 'accordion') {
    const items = await Promise.all(
      element.items.map(async (item) => ({ ...item, answer: await resolveLocalized(item.answer, resolve) })),
    )
    return { ...element, items }
  }
  return element
}
