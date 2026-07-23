import { z } from 'zod'
import type { CollaboratorTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { CollaboratorLocalizedString } from './collaborator.types'

type V = CollaboratorTranslations['validation']

export function createCollaboratorSchema(v: V, primaryLang: Language = 'en') {
  const optionalText = z.string().trim().optional().or(z.literal(''))
  const optionalUrl = z
    .string()
    .trim()
    .url(v.urlInvalid)
    .optional()
    .or(z.literal(''))

  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : optionalText,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  function localizedField() {
    return z.object(langFields)
  }

  return z.object({
    name: z.string().trim().min(1, v.required).max(100, v.nameMax),
    role: z.string().trim().min(1, v.required),
    level: optionalText,
    bio: localizedField(),
    photoUrl: optionalUrl,
    socialLinks: z.object({
      linkedin: optionalUrl,
      twitter: optionalUrl,
      github: optionalUrl,
      website: optionalUrl,
      instagram: optionalUrl,
    }),
    userId: z.string().trim().uuid().optional().or(z.literal('')),
    order: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
}

export type CollaboratorFormLocalized = Record<Language, string>

export interface CollaboratorFormData {
  name: string
  role: string
  level?: string
  bio: CollaboratorFormLocalized
  photoUrl?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
    instagram?: string
  }
  userId?: string
  order: number
  isActive: boolean
}

export interface CreateCollaboratorPayload {
  name: string
  role: string
  level?: string
  bio: CollaboratorLocalizedString
  photoUrl?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
    instagram?: string
  }
  userId?: string
  order: number
  isActive: boolean
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): CollaboratorLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as CollaboratorLocalizedString
}

function buildSocialLinks(
  links: CollaboratorFormData['socialLinks']
): CreateCollaboratorPayload['socialLinks'] {
  if (!links || !Object.values(links).some(Boolean)) return undefined
  return {
    linkedin: links.linkedin || undefined,
    twitter: links.twitter || undefined,
    github: links.github || undefined,
    website: links.website || undefined,
    instagram: links.instagram || undefined,
  }
}

export function toCollaboratorPayload(
  data: CollaboratorFormData
): CreateCollaboratorPayload {
  return {
    name: data.name,
    role: data.role,
    level: data.level || undefined,
    bio: fillLocalized(data.bio),
    photoUrl: data.photoUrl || undefined,
    socialLinks: buildSocialLinks(data.socialLinks),
    userId: data.userId || undefined,
    order: data.order,
    isActive: data.isActive,
  }
}
