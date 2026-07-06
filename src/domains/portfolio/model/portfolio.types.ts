import type { Language } from '@/shared/i18n'

export type PortfolioStatus = 'draft' | 'published' | 'archived'

export type PortfolioLocalizedString = Record<Language, string>

export interface PortfolioTestimonial {
  quote: PortfolioLocalizedString
  authorName: string
  authorPosition?: string
}

export interface PortfolioMetric {
  label: PortfolioLocalizedString
  value: string
}

export interface Portfolio {
  id: string
  slug: string
  name: PortfolioLocalizedString
  shortDescription: PortfolioLocalizedString
  description: PortfolioLocalizedString
  coverImageUrl: string
  gallery: string[]
  clientId?: string
  serviceIds: string[]
  technologies: string[]
  projectUrl?: string
  startDate: string
  endDate?: string
  featured: boolean
  order: number
  testimonial?: PortfolioTestimonial
  metrics: PortfolioMetric[]
  status: PortfolioStatus
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface PortfolioListParams {
  page?: number
  limit?: number
  status?: PortfolioStatus
}

export interface PortfolioPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
