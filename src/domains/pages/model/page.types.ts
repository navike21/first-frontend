import type { Language } from '@/shared/i18n'

export type PageLocalizedString = Record<Language, string>
export type PageStatus = 'draft' | 'scheduled' | 'published'

export interface PageSeo {
  metaTitle?: PageLocalizedString
  metaDescription?: PageLocalizedString
  keywords?: PageLocalizedString
  ogImage?: string
}

// ── Builder (secciones) ─────────────────────────────────────────────────────

export type BuilderColumnsCount = 1 | 2 | 3 | 4

export interface BuilderTextElement {
  id: string
  type: 'text'
  html: PageLocalizedString
}

export interface BuilderImageElement {
  id: string
  type: 'image'
  url: string
  alt: PageLocalizedString
  /** CSS size, p. ej. '320px' o '50%'; '' = auto. */
  width: string
  height: string
  align: 'left' | 'center' | 'right'
}

export interface BuilderSliderSlide {
  url: string
  kind: 'image' | 'video'
  /** Cover image for a video slide (thumb/full URL, or a local blob preview
   * right after capture) — lets the tile show a real frame without ever
   * loading the video itself. Unused for image slides. */
  posterUrl?: string
}

export interface BuilderSliderElement {
  id: string
  type: 'slider'
  slides: BuilderSliderSlide[]
}

export type BuilderElement = BuilderTextElement | BuilderImageElement | BuilderSliderElement

export interface BuilderColumn {
  id: string
  elements: BuilderElement[]
}

// ── Fondo de sección (por breakpoint) ───────────────────────────────────────

export type BackgroundBreakpoint = 'desktop' | 'tablet' | 'mobile'
export type BackgroundPosition = 'top' | 'center' | 'bottom'
export type BackgroundSourceKind = 'upload' | 'embed'
/** Qué archivo de fondo se está subiendo/eligiendo: la imagen, o uno de los
 * dos formatos de video (para <source> múltiples de compatibilidad). */
export type BackgroundFileSlot = 'image' | 'video-mp4' | 'video-webm'

export interface BackgroundVideoFile {
  url: string
  mimeType?: string
}

export interface BackgroundNone {
  type: 'none'
}

export interface BackgroundImage {
  type: 'image'
  url?: string
  position: BackgroundPosition
  fullScreen: boolean
  parallax: boolean
}

export interface BackgroundVideo {
  type: 'video'
  sourceKind: BackgroundSourceKind
  /** Uno por formato (mp4/webm) cuando sourceKind === 'upload'; máx 2. */
  files: BackgroundVideoFile[]
  embedUrl?: string
  parallax: boolean
}

export type BackgroundConfig = BackgroundNone | BackgroundImage | BackgroundVideo

/** Cada breakpoint es independiente: no hereda del anterior. */
export interface SectionBackground {
  desktop?: BackgroundConfig
  tablet?: BackgroundConfig
  mobile?: BackgroundConfig
}

/** Sección genérica: 'columns' es editable en el builder; otros tipos se
 * conservan intactos (tarjeta de solo lectura hasta que tengan editor). */
export interface BuilderSection {
  sectionId: string
  type: string
  order: number
  settings: {
    columns?: number
    tabletColumns?: number
    mobileColumns?: number
    hiddenOnTablet?: boolean
    hiddenOnMobile?: boolean
    background?: SectionBackground
    [key: string]: unknown
  }
  content: { columns?: BuilderColumn[]; [key: string]: unknown }
}

export interface Page {
  id: string
  slug: PageLocalizedString
  fullPath: PageLocalizedString
  title: PageLocalizedString
  description?: PageLocalizedString
  coverImageUrl?: string
  seo?: PageSeo
  parentId?: string | null
  status: PageStatus
  effectiveStatus?: PageStatus
  scheduledAt?: string
  categoryIds: string[]
  tagIds: string[]
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  sections?: BuilderSection[]
}

export interface PageListParams {
  page?: number
  limit?: number
  search?: string
  status?: PageStatus
  parentId?: string
}

export interface PagePaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PageRevision {
  id: string
  pageId: string
  snapshot: Record<string, unknown>
  createdBy?: string
  createdAt: string
}
