import { z } from 'zod'
import type { CategoryTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { CategoryLocalizedString } from './category.types'

type V = CategoryTranslations['validation']

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createCategorySchema(v: V, primaryLang: Language = 'en') {
  const optionalText = z.string().trim().optional().or(z.literal(''))

  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : optionalText,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  const slugLangField = z
    .string()
    .trim()
    .regex(slugRegex, v.slugInvalid)
    .optional()
    .or(z.literal(''))

  return z.object({
    name: z.object(langFields),
    slug: z.object(
      Object.fromEntries(
        SUPPORTED_LANGUAGES.map((l) => [l, slugLangField])
      ) as Record<Language, typeof slugLangField>
    ),
    parentId: z.string().trim().uuid().optional().or(z.literal('')),
    order: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
}

export type CategoryFormLocalized = Record<Language, string>

export interface CategoryFormData {
  name: CategoryFormLocalized
  slug: CategoryFormLocalized
  parentId?: string
  order: number
  isActive: boolean
}

export interface CreateCategoryPayload {
  name: CategoryLocalizedString
  slug: CategoryLocalizedString
  parentId?: string
  order: number
  isActive: boolean
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): CategoryLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as CategoryLocalizedString
}

export function toCategoryPayload(
  data: CategoryFormData
): CreateCategoryPayload {
  return {
    name: fillLocalized(data.name),
    slug: fillLocalized(data.slug),
    parentId: data.parentId || undefined,
    order: data.order,
    isActive: data.isActive,
  }
}
