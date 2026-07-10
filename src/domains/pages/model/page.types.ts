import type { Language } from '@/shared/i18n'

export type PageLocalizedString = Record<Language, string>
export type PageStatus = 'draft' | 'scheduled' | 'published'

export interface PageSeo {
  metaTitle?: PageLocalizedString
  metaDescription?: PageLocalizedString
  keywords?: PageLocalizedString
  ogImage?: string
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
