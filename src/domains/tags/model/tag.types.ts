import type { Language } from '@/shared/i18n'

export type TagLocalizedString = Record<Language, string>

export interface Tag {
  id: string
  name: TagLocalizedString
  slug: string
  order: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface TagListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface TagPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
