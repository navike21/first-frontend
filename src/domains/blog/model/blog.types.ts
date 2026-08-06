import type { Language } from '@/shared/i18n'

export type BlogLocalizedString = Record<Language, string>
export type BlogStatus = 'draft' | 'scheduled' | 'published'

export interface BlogSeo {
  metaTitle?: BlogLocalizedString
  metaDescription?: BlogLocalizedString
  keywords?: BlogLocalizedString
  ogImage?: string
}

export interface Post {
  id: string
  slug: BlogLocalizedString
  title: BlogLocalizedString
  excerpt?: BlogLocalizedString
  content: BlogLocalizedString
  coverImageUrl: string
  categoryIds: string[]
  tagIds: string[]
  authorId?: string
  seo?: BlogSeo
  status: BlogStatus
  effectiveStatus?: BlogStatus
  scheduledAt?: string
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface BlogListParams {
  page?: number
  limit?: number
  status?: BlogStatus
  categoryId?: string
  tagId?: string
}

export interface BlogPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
