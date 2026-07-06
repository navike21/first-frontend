import { z } from 'zod'
import type { PortfolioTranslations } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { PortfolioLocalizedString, PortfolioStatus } from './portfolio.types'

type V = PortfolioTranslations['validation']

export const PORTFOLIO_STATUS_VALUES = ['draft', 'published', 'archived'] as const

const opt = z.string().trim().optional().or(z.literal(''))

export function createPortfolioSchema(v: V, primaryLang: Language = 'en') {
  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      l === primaryLang ? z.string().trim().min(1, v.required) : opt,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>

  function localizedField() {
    return z.object(langFields)
  }

  return z.object({
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, v.slugInvalid)
      .min(1, v.required),
    name: localizedField(),
    shortDescription: localizedField(),
    description: localizedField(),
    serviceIds: z.array(z.string().uuid()).min(1, v.serviceRequired),
    clientId: z.string().uuid().optional().or(z.literal('')),
    technologies: z.string().trim().optional().or(z.literal('')),
    projectUrl: z.string().url(v.urlInvalid).optional().or(z.literal('')),
    startDate: z.string().min(1, v.required),
    endDate: z.string().optional().or(z.literal('')),
    featured: z.boolean().default(false),
    order: z.coerce.number().int().min(0).default(0),
    status: z.enum(PORTFOLIO_STATUS_VALUES).default('draft'),
  })
}

export type PortfolioFormLocalized = Record<Language, string>

export interface PortfolioFormData {
  slug: string
  name: PortfolioFormLocalized
  shortDescription: PortfolioFormLocalized
  description: PortfolioFormLocalized
  serviceIds: string[]
  clientId?: string
  technologies?: string
  projectUrl?: string
  startDate: string
  endDate?: string
  featured: boolean
  order: number
  status: PortfolioStatus
}

export interface CreatePortfolioPayload {
  slug?: string
  name: PortfolioLocalizedString
  shortDescription: PortfolioLocalizedString
  description: PortfolioLocalizedString
  serviceIds: string[]
  clientId?: string
  technologies: string[]
  projectUrl?: string
  startDate: string
  endDate?: string
  featured: boolean
  order: number
  status: PortfolioStatus
  gallery: never[]
  metrics: never[]
}

function fillLocalized(input: Partial<Record<Language, string>>): PortfolioLocalizedString {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as PortfolioLocalizedString
}

export function toPortfolioPayload(data: PortfolioFormData): CreatePortfolioPayload {
  return {
    slug: data.slug || undefined,
    name: fillLocalized(data.name),
    shortDescription: fillLocalized(data.shortDescription),
    description: fillLocalized(data.description),
    serviceIds: data.serviceIds,
    clientId: data.clientId?.trim() || undefined,
    technologies: data.technologies
      ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    projectUrl: data.projectUrl?.trim() || undefined,
    startDate: data.startDate,
    endDate: data.endDate?.trim() || undefined,
    featured: data.featured,
    order: data.order,
    status: data.status,
    gallery: [],
    metrics: [],
  }
}
