import { z } from 'zod'
import type { ServicesTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { ServiceLocalizedString } from './service.types'

type V = ServicesTranslations['validation']

export const PILLAR_VALUES = [
  'responsibility',
  'people',
  'continuous-learning',
  'tech-adaptation',
  'digital-experience',
  'business-growth',
] as const

const opt = z.string().trim().optional().or(z.literal(''))

export function createServiceSchema(v: V, primaryLang: Language = 'en') {
  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : opt,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  function localizedField() {
    return z.object(langFields)
  }

  const slugLangField = z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, v.slugInvalid)
    .optional()
    .or(z.literal(''))

  return z.object({
    name: localizedField(),
    shortDescription: localizedField(),
    description: localizedField(),
    slug: z.object(
      Object.fromEntries(
        SUPPORTED_LANGUAGES.map((l) => [l, slugLangField])
      ) as Record<Language, typeof slugLangField>
    ),
    pillars: z.array(z.enum(PILLAR_VALUES)).default([]),
    tags: z.string().trim().optional().or(z.literal('')),
    order: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
}

export type ServiceFormLocalized = Record<Language, string>

export interface ServiceFormData {
  name: ServiceFormLocalized
  shortDescription: ServiceFormLocalized
  description: ServiceFormLocalized
  slug: ServiceFormLocalized
  pillars: (typeof PILLAR_VALUES)[number][]
  tags?: string
  order: number
  isActive: boolean
}

export interface CreateServicePayload {
  name: ServiceLocalizedString
  shortDescription: ServiceLocalizedString
  description: ServiceLocalizedString
  slug: ServiceLocalizedString
  icon?: string
  coverImageUrl?: string
  pillars: string[]
  tags: string[]
  order: number
  isActive: boolean
  status: 'active' | 'inactive'
  highlights: never[]
}

export function fillLocalized(
  input: Partial<Record<Language, string>>
): ServiceLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as ServiceLocalizedString
}

export function toServicePayload(data: ServiceFormData): CreateServicePayload {
  return {
    name: fillLocalized(data.name),
    shortDescription: fillLocalized(data.shortDescription),
    description: fillLocalized(data.description),
    slug: fillLocalized(data.slug),
    pillars: data.pillars,
    tags: data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    order: data.order,
    isActive: data.isActive,
    status: 'active',
    highlights: [],
  }
}
