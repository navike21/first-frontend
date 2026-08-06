import { z } from 'zod'
import type { BlogTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { BlogLocalizedString, BlogSeo, BlogStatus } from './blog.types'

type V = BlogTranslations['validation']

export const BLOG_STATUS_VALUES = ['draft', 'scheduled', 'published'] as const

const opt = z.string().trim().optional().or(z.literal(''))

const slugLangField = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .optional()
  .or(z.literal(''))

const optionalLocalizedField = z.object(
  Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, opt])) as unknown as Record<
    Language,
    z.ZodTypeAny
  >
)

export function createBlogPostSchema(v: V, primaryLang: Language = 'en') {
  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : opt,
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
      excerpt: optionalLocalizedField,
      content: z.object(langFields),
      categoryIds: z.array(z.string()).default([]),
      tagIds: z.array(z.string()).default([]),
      authorId: z.string().trim().uuid().optional().or(z.literal('')),
      seoMetaTitle: optionalLocalizedField,
      seoMetaDescription: optionalLocalizedField,
      seoKeywords: optionalLocalizedField,
      seoOgImage: z
        .string()
        .trim()
        .url(v.urlInvalid)
        .optional()
        .or(z.literal('')),
      status: z.enum(BLOG_STATUS_VALUES).default('draft'),
      scheduledAt: z.string().optional().or(z.literal('')),
    })
    .refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
      message: v.scheduledAtRequired,
      path: ['scheduledAt'],
    })
}

export type BlogFormLocalized = Record<Language, string>

export interface BlogFormData {
  title: BlogFormLocalized
  slug: BlogFormLocalized
  excerpt: BlogFormLocalized
  content: BlogFormLocalized
  categoryIds: string[]
  tagIds: string[]
  authorId?: string
  seoMetaTitle: BlogFormLocalized
  seoMetaDescription: BlogFormLocalized
  seoKeywords: BlogFormLocalized
  seoOgImage?: string
  status: BlogStatus
  scheduledAt?: string
}

export interface CreateBlogPostPayload {
  title: BlogLocalizedString
  slug?: BlogLocalizedString
  excerpt?: BlogLocalizedString
  content: BlogLocalizedString
  coverImageUrl?: string
  categoryIds: string[]
  tagIds: string[]
  authorId?: string
  seo?: BlogSeo
  status: BlogStatus
  scheduledAt?: string
}

function fillLocalized(
  input: Partial<Record<Language, string>>
): BlogLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as BlogLocalizedString
}

function toIsoOrUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function toBlogPostPayload(data: BlogFormData): CreateBlogPostPayload {
  return {
    title: fillLocalized(data.title),
    slug: fillLocalized(data.slug),
    excerpt: fillLocalized(data.excerpt),
    content: fillLocalized(data.content),
    categoryIds: data.categoryIds,
    tagIds: data.tagIds,
    authorId: data.authorId?.trim() || undefined,
    seo: {
      metaTitle: fillLocalized(data.seoMetaTitle),
      metaDescription: fillLocalized(data.seoMetaDescription),
      keywords: fillLocalized(data.seoKeywords),
      ogImage: data.seoOgImage?.trim() ?? '',
    },
    status: data.status,
    scheduledAt:
      data.status === 'scheduled'
        ? toIsoOrUndefined(data.scheduledAt)
        : undefined,
  }
}
