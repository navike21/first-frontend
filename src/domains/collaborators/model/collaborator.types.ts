import type { Language } from '@/shared/i18n'

export type CollaboratorLocalizedString = Record<Language, string>

export interface CollaboratorSocialLinks {
  linkedin?: string
  twitter?: string
  github?: string
  website?: string
  instagram?: string
}

export interface Collaborator {
  id: string
  name: string
  role: string
  level?: string
  bio: CollaboratorLocalizedString
  photoUrl?: string
  socialLinks?: CollaboratorSocialLinks
  userId?: string
  order: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface CollaboratorListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface CollaboratorPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
