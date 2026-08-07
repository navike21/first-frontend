import type { Language } from '@/shared/i18n'

export type ProductCategoryLocalizedString = Record<Language, string>

export interface ProductCategory {
  id: string
  name: ProductCategoryLocalizedString
  slug: ProductCategoryLocalizedString
  parentId?: string | null
  order: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface ProductCategoryListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  parentId?: string
}

export interface ProductCategoryPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
