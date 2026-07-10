import { z } from 'zod'
import type { TagTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { TagLocalizedString } from './tag.types'

type V = TagTranslations['validation']

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createTagSchema(v: V, primaryLang: Language = 'en') {
  const optionalText = z.string().trim().optional().or(z.literal(''))

  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : optionalText,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  return z.object({
    name: z.object(langFields),
    slug: z.string().trim().min(1, v.required).regex(slugRegex, v.slugInvalid),
    order: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
}

export type TagFormLocalized = Record<Language, string>

export interface TagFormData {
  name: TagFormLocalized
  slug: string
  order: number
  isActive: boolean
}

export interface CreateTagPayload {
  name: TagLocalizedString
  slug: string
  order: number
  isActive: boolean
}

function fillLocalized(input: Partial<Record<Language, string>>): TagLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as TagLocalizedString
}

export function toTagPayload(data: TagFormData): CreateTagPayload {
  return {
    name: fillLocalized(data.name),
    slug: data.slug,
    order: data.order,
    isActive: data.isActive,
  }
}
