import { z } from 'zod'
import type { ProductCategoryTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { ProductCategoryLocalizedString } from './productCategory.types'

type V = ProductCategoryTranslations['validation']

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createProductCategorySchema(
  v: V,
  primaryLang: Language = 'en'
) {
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

export type ProductCategoryFormLocalized = Record<Language, string>

export interface ProductCategoryFormData {
  name: ProductCategoryFormLocalized
  slug: ProductCategoryFormLocalized
  parentId?: string
  order: number
  isActive: boolean
}

export interface CreateProductCategoryPayload {
  name: ProductCategoryLocalizedString
  slug: ProductCategoryLocalizedString
  parentId?: string
  order: number
  isActive: boolean
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): ProductCategoryLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as ProductCategoryLocalizedString
}

export function toProductCategoryPayload(
  data: ProductCategoryFormData
): CreateProductCategoryPayload {
  return {
    name: fillLocalized(data.name),
    slug: fillLocalized(data.slug),
    parentId: data.parentId || undefined,
    order: data.order,
    isActive: data.isActive,
  }
}
