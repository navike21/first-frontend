import { z } from 'zod'
import type { PageTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { PageLocalizedString, PageSeo } from './page.types'

type V = PageTranslations['validation']

export const PAGE_STATUS_VALUES = ['draft', 'scheduled', 'published'] as const

const slugLangField = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .optional()
  .or(z.literal(''))

const optionalLocalizedField = z.object(
  Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      z.string().trim().optional().or(z.literal('')),
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>
)

export function createPageSchema(v: V, primaryLang: Language = 'en') {
  const optionalText = z.string().trim().optional().or(z.literal(''))
  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : optionalText,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  return z
    .object({
      title: z.object(langFields),
      slug: z.object(
        Object.fromEntries(
          SUPPORTED_LANGUAGES.map((l) => [l, slugLangField])
        ) as Record<Language, typeof slugLangField>
      ),
      seoMetaTitle: optionalLocalizedField,
      seoMetaDescription: optionalLocalizedField,
      seoKeywords: optionalLocalizedField,
      seoOgImage: z
        .string()
        .trim()
        .url(v.urlInvalid)
        .optional()
        .or(z.literal('')),
      parentId: z.string().trim().uuid().optional().or(z.literal('')),
      status: z.enum(PAGE_STATUS_VALUES).default('draft'),
      scheduledAt: z.string().optional().or(z.literal('')),
      categoryIds: z.array(z.string()).default([]),
      tagIds: z.array(z.string()).default([]),
    })
    .refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
      message: v.scheduledAtRequired,
      path: ['scheduledAt'],
    })
}

export type PageFormLocalized = Record<Language, string>

export interface PageFormData {
  title: PageFormLocalized
  slug: PageFormLocalized
  seoMetaTitle: PageFormLocalized
  seoMetaDescription: PageFormLocalized
  seoKeywords: PageFormLocalized
  seoOgImage?: string
  parentId?: string
  status: (typeof PAGE_STATUS_VALUES)[number]
  scheduledAt?: string
  categoryIds: string[]
  tagIds: string[]
}

export interface CreatePagePayload {
  title: PageLocalizedString
  slug?: PageLocalizedString
  description?: PageLocalizedString
  seo?: PageSeo
  parentId?: string
  status: (typeof PAGE_STATUS_VALUES)[number]
  scheduledAt?: string
  categoryIds: string[]
  tagIds: string[]
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): PageLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as PageLocalizedString
}

function toIsoOrUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function toPagePayload(data: PageFormData): CreatePagePayload {
  // description/sections intencionalmente fuera del payload: el contenido de
  // la web lo gestionará el builder dedicado, este módulo solo configura la
  // página por fuera (título, SEO, imágenes, organización, estado).
  return {
    title: fillLocalized(data.title),
    slug: fillLocalized(data.slug),
    seo: {
      metaTitle: fillLocalized(data.seoMetaTitle),
      metaDescription: fillLocalized(data.seoMetaDescription),
      keywords: fillLocalized(data.seoKeywords),
      // '' intencional: le indica al backend que borre la imagen OG guardada.
      ogImage: data.seoOgImage?.trim() ?? '',
    },
    parentId: data.parentId || undefined,
    status: data.status,
    scheduledAt:
      data.status === 'scheduled'
        ? toIsoOrUndefined(data.scheduledAt)
        : undefined,
    categoryIds: data.categoryIds,
    tagIds: data.tagIds,
  }
}
