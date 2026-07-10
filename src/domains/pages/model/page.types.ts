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

export type BuilderElement = BuilderTextElement | BuilderImageElement

export interface BuilderColumn {
  id: string
  elements: BuilderElement[]
}

/** Sección genérica: 'columns' es editable en el builder; otros tipos se
 * conservan intactos (tarjeta de solo lectura hasta que tengan editor). */
export interface BuilderSection {
  sectionId: string
  type: string
  order: number
  settings: { columns?: number; [key: string]: unknown }
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
