import type { Language } from '@/shared/i18n'

export type ProductStatus = 'draft' | 'active' | 'archived'
export type ProductLocalizedString = Record<Language, string>

export interface Money {
  amount: number
  currency: string
}

export interface ProductSeo {
  metaTitle?: ProductLocalizedString
  metaDescription?: ProductLocalizedString
  keywords?: ProductLocalizedString
  ogImage?: string
}

export interface ProductVariantOption {
  name: ProductLocalizedString
  values: string[]
}

export interface ProductVariant {
  id: string
  sku?: string
  optionValues: Record<string, string>
  price: Money
  compareAtPrice?: Money
  imageUrl?: string
}

export interface Product {
  id: string
  slug: ProductLocalizedString
  name: ProductLocalizedString
  shortDescription?: ProductLocalizedString
  description?: ProductLocalizedString
  sku?: string
  price: Money
  compareAtPrice?: Money
  categoryIds: string[]
  tagIds: string[]
  gallery: string[]
  status: ProductStatus
  seo?: ProductSeo
  hasVariants: boolean
  variantOptions: ProductVariantOption[]
  variants: ProductVariant[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  status?: ProductStatus
  categoryId?: string
  tagId?: string
}

export interface ProductPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
