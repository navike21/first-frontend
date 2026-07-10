import type { Language } from '@/shared/i18n'

export type CategoryLocalizedString = Record<Language, string>

export interface Category {
  id: string
  name: CategoryLocalizedString
  slug: string
  parentId?: string | null
  order: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface CategoryListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  parentId?: string
}

export interface CategoryPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
