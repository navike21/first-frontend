export type ServiceStatus = 'active' | 'inactive'

export const PILLARS = [
  'responsibility',
  'people',
  'continuous-learning',
  'tech-adaptation',
  'digital-experience',
  'business-growth',
] as const

export type Pillar = (typeof PILLARS)[number]

export interface ServiceLocalizedString {
  es: string
  en: string
  de: string
  fr: string
  it: string
  ja: string
  ko: string
  pt: string
  ru: string
  zh: string
}

export interface Service {
  id: string
  slug: string
  name: ServiceLocalizedString
  shortDescription: ServiceLocalizedString
  description: ServiceLocalizedString
  icon?: string
  coverImageUrl?: string
  pillars: Pillar[]
  highlights: ServiceLocalizedString[]
  tags: string[]
  order: number
  isActive: boolean
  status: ServiceStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface ServiceListParams {
  page?: number
  limit?: number
  status?: ServiceStatus
  search?: string
}

export interface ServicePaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
