import { z } from 'zod'
import type { ProductTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { ProductLocalizedString, Money } from './product.types'

type V = ProductTranslations['validation']

export const PRODUCT_STATUS_VALUES = ['draft', 'active', 'archived'] as const

const opt = z.string().trim().optional().or(z.literal(''))
const slugLangField = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .optional()
  .or(z.literal(''))

const priceField = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/)
const optPriceField = priceField.optional().or(z.literal(''))

function emptyLocalizedSchema() {
  return z.object(
    Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, opt])) as Record<
      Language,
      typeof opt
    >
  )
}

const variantOptionSchema = z.object({
  name: emptyLocalizedSchema(),
  valuesText: z.string().trim(),
})

const variantSchema = z.object({
  id: z.string().optional(),
  sku: opt,
  optionValues: z.record(z.string(), z.string()),
  price: priceField,
  compareAtPrice: optPriceField,
  imageUrl: opt,
})

export function createProductSchema(v: V, primaryLang: Language = 'en') {
  const nameFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : opt,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  return z
    .object({
      slug: z.object(
        Object.fromEntries(
          SUPPORTED_LANGUAGES.map((l) => [l, slugLangField])
        ) as Record<Language, typeof slugLangField>
      ),
      name: z.object(nameFields),
      shortDescription: emptyLocalizedSchema(),
      description: emptyLocalizedSchema(),
      sku: opt,
      price: priceField,
      compareAtPrice: optPriceField,
      categoryIds: z.array(z.string()).default([]),
      tagIds: z.array(z.string()).default([]),
      status: z.enum(PRODUCT_STATUS_VALUES).default('draft'),
      seoMetaTitle: emptyLocalizedSchema(),
      seoMetaDescription: emptyLocalizedSchema(),
      seoKeywords: emptyLocalizedSchema(),
      seoOgImage: z.string().url(v.urlInvalid).optional().or(z.literal('')),
      hasVariants: z.boolean().default(false),
      variantOptions: z.array(variantOptionSchema).default([]),
      variants: z.array(variantSchema).default([]),
    })
    .refine((data) => !data.hasVariants || data.variants.length > 0, {
      message: v.variantsRequired,
      path: ['variants'],
    })
}

export type ProductFormLocalized = Record<Language, string>

export interface ProductVariantOptionFormData {
  name: ProductFormLocalized
  /** Raw comma-separated values (e.g. "S, M, L") — parsed on "generate combinations". */
  valuesText: string
}

export interface ProductVariantFormData {
  id?: string
  sku?: string
  optionValues: Record<string, string>
  /** Major-units decimal string (e.g. "19.99") — matches `PriceInput`'s raw value. */
  price: string
  compareAtPrice?: string
  imageUrl?: string
}

export interface ProductFormData {
  slug: ProductFormLocalized
  name: ProductFormLocalized
  shortDescription: ProductFormLocalized
  description: ProductFormLocalized
  sku?: string
  price: string
  compareAtPrice?: string
  categoryIds: string[]
  tagIds: string[]
  status: (typeof PRODUCT_STATUS_VALUES)[number]
  seoMetaTitle: ProductFormLocalized
  seoMetaDescription: ProductFormLocalized
  seoKeywords: ProductFormLocalized
  seoOgImage?: string
  hasVariants: boolean
  variantOptions: ProductVariantOptionFormData[]
  variants: ProductVariantFormData[]
}

export type GalleryOrderToken =
  | { type: 'existing'; url: string }
  | { type: 'new'; index: number }

export interface CreateProductPayload {
  slug: ProductLocalizedString
  name: ProductLocalizedString
  shortDescription: ProductLocalizedString
  description: ProductLocalizedString
  sku?: string
  price: Money
  compareAtPrice?: Money
  categoryIds: string[]
  tagIds: string[]
  gallery: string[]
  status: (typeof PRODUCT_STATUS_VALUES)[number]
  seo: {
    metaTitle: ProductLocalizedString
    metaDescription: ProductLocalizedString
    keywords: ProductLocalizedString
    ogImage?: string
  }
  hasVariants: boolean
  variantOptions: { name: ProductLocalizedString; values: string[] }[]
  variants: {
    id?: string
    sku?: string
    optionValues: Record<string, string>
    price: Money
    compareAtPrice?: Money
    imageUrl?: string
  }[]
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): ProductLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as ProductLocalizedString
}

/** Converts a `PriceInput` raw major-units decimal string to integer-cents `Money`. */
export function toMoney(raw: string, currency: string): Money {
  const majorUnits = Number.parseFloat(raw || '0')
  return { amount: Math.round(majorUnits * 100), currency }
}

/** Converts integer-cents `Money` back to a `PriceInput` raw major-units decimal string. */
export function fromMoney(money?: Money): string {
  if (!money) return ''
  return (money.amount / 100).toFixed(2)
}

export function parseValuesText(valuesText: string): string[] {
  return valuesText
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

/**
 * Maps form state to the create/update payload — everything except `gallery`,
 * which the caller (the form component) assembles separately from its own
 * `GalleryItem[]` state (existing-library URLs on create; omitted entirely
 * on update, where `galleryOrder` alone drives reconciliation server-side).
 */
export function toProductPayload(
  data: ProductFormData,
  currency: string
): Omit<CreateProductPayload, 'gallery'> {
  return {
    slug: fillLocalized(data.slug),
    name: fillLocalized(data.name),
    shortDescription: fillLocalized(data.shortDescription),
    description: fillLocalized(data.description),
    sku: data.sku?.trim() || undefined,
    price: toMoney(data.price, currency),
    compareAtPrice: data.compareAtPrice
      ? toMoney(data.compareAtPrice, currency)
      : undefined,
    categoryIds: data.categoryIds,
    tagIds: data.tagIds,
    status: data.status,
    seo: {
      metaTitle: fillLocalized(data.seoMetaTitle),
      metaDescription: fillLocalized(data.seoMetaDescription),
      keywords: fillLocalized(data.seoKeywords),
      ogImage: data.seoOgImage?.trim() || undefined,
    },
    hasVariants: data.hasVariants,
    variantOptions: data.hasVariants
      ? data.variantOptions.map((o) => ({
          name: fillLocalized(o.name),
          values: parseValuesText(o.valuesText),
        }))
      : [],
    variants: data.hasVariants
      ? data.variants.map((v) => ({
          id: v.id,
          sku: v.sku?.trim() || undefined,
          optionValues: v.optionValues,
          price: toMoney(v.price, currency),
          compareAtPrice: v.compareAtPrice
            ? toMoney(v.compareAtPrice, currency)
            : undefined,
          imageUrl: v.imageUrl?.trim() || undefined,
        }))
      : [],
  }
}
