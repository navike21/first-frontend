import type { Language } from '@/shared/i18n'
import type { Page } from './page.types'

export type SeoCheckStatus = 'good' | 'warning' | 'bad'
export type SeoLight = 'green' | 'amber' | 'red'

export type SeoCheckId =
  | 'titleDefined'
  | 'slugDefined'
  | 'metaTitleLength'
  | 'metaDescriptionLength'
  | 'socialImage'
  | 'keywordDefined'
  | 'keywordInTitle'
  | 'keywordInDescription'
  | 'keywordInSlug'

export interface SeoCheck {
  id: SeoCheckId
  status: SeoCheckStatus
}

export interface SeoLengthMetric {
  length: number
  min: number
  max: number
  status: SeoCheckStatus
}

export interface SeoAnalysis {
  checks: SeoCheck[]
  score: number
  light: SeoLight
  goodCount: number
  warningCount: number
  badCount: number
  focusKeyword: string
  effectiveTitle: string
  effectiveDescription: string
  socialImageUrl: string
  metaTitle: SeoLengthMetric
  metaDescription: SeoLengthMetric
}

export const META_TITLE_MIN = 30
export const META_TITLE_MAX = 60
export const META_DESCRIPTION_MIN = 120
export const META_DESCRIPTION_MAX = 156
export const SOCIAL_IMAGE_MIN_WIDTH = 1200
export const SOCIAL_IMAGE_MIN_HEIGHT = 630

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()

const contains = (haystack: string, needle: string): boolean =>
  !!haystack && !!needle && normalize(haystack).includes(normalize(needle))

function lengthStatus(
  length: number,
  min: number,
  max: number
): SeoCheckStatus {
  if (length === 0) return 'bad'
  if (length >= min && length <= max) return 'good'
  return 'warning'
}

export function buildLengthMetric(
  length: number,
  min: number,
  max: number
): SeoLengthMetric {
  return { length, min, max, status: lengthStatus(length, min, max) }
}

function lightFor(score: number): SeoLight {
  if (score >= 80) return 'green'
  if (score >= 50) return 'amber'
  return 'red'
}

const STATUS_POINTS: Record<SeoCheckStatus, number> = {
  good: 1,
  warning: 0.5,
  bad: 0,
}

interface SeoFields {
  title: string
  slug: string
  focusKeyword: string
  effectiveTitle: string
  effectiveDescription: string
  socialImageUrl: string
  metaTitle: SeoLengthMetric
  metaDescription: SeoLengthMetric
}

function extractFields(page: Page, lang: Language): SeoFields {
  const title = page.title?.[lang]?.trim() ?? ''
  const slug = page.slug?.[lang]?.trim() ?? ''
  const metaTitleRaw = page.seo?.metaTitle?.[lang]?.trim() ?? ''
  const metaDescriptionRaw = page.seo?.metaDescription?.[lang]?.trim() ?? ''
  const keywordsRaw = page.seo?.keywords?.[lang] ?? ''
  // The first keyword acts as the focus keyword (Yoast-style keyphrase).
  const focusKeyword = keywordsRaw.split(',')[0]?.trim() ?? ''

  const effectiveTitle = metaTitleRaw || title
  // Page content lives in the dedicated builder — SEO here only evaluates the
  // outside-facing configuration, so the meta description stands on its own.
  const effectiveDescription = metaDescriptionRaw

  return {
    title,
    slug,
    focusKeyword,
    effectiveTitle,
    effectiveDescription,
    // `||` (no `??`): un ogImage guardado como '' debe caer a la portada.
    socialImageUrl: page.seo?.ogImage || page.coverImageUrl || '',
    metaTitle: buildLengthMetric(
      effectiveTitle.length,
      META_TITLE_MIN,
      META_TITLE_MAX
    ),
    metaDescription: buildLengthMetric(
      effectiveDescription.length,
      META_DESCRIPTION_MIN,
      META_DESCRIPTION_MAX
    ),
  }
}

function buildChecks(fields: SeoFields): SeoCheck[] {
  const checks: SeoCheck[] = [
    { id: 'titleDefined', status: fields.title ? 'good' : 'bad' },
    { id: 'slugDefined', status: fields.slug ? 'good' : 'bad' },
    { id: 'metaTitleLength', status: fields.metaTitle.status },
    { id: 'metaDescriptionLength', status: fields.metaDescription.status },
    { id: 'socialImage', status: fields.socialImageUrl ? 'good' : 'warning' },
    { id: 'keywordDefined', status: fields.focusKeyword ? 'good' : 'bad' },
  ]

  if (fields.focusKeyword) {
    checks.push(
      {
        id: 'keywordInTitle',
        status: contains(fields.effectiveTitle, fields.focusKeyword)
          ? 'good'
          : 'bad',
      },
      {
        id: 'keywordInDescription',
        status: contains(fields.effectiveDescription, fields.focusKeyword)
          ? 'good'
          : 'warning',
      },
      {
        id: 'keywordInSlug',
        status: contains(fields.slug.replace(/-/g, ' '), fields.focusKeyword)
          ? 'good'
          : 'warning',
      }
    )
  }

  return checks
}

export function analyzePageSeo(page: Page, lang: Language): SeoAnalysis {
  const fields = extractFields(page, lang)
  const checks = buildChecks(fields)

  const points = checks.reduce(
    (sum, check) => sum + STATUS_POINTS[check.status],
    0
  )
  const score = Math.round((points / checks.length) * 100)

  return {
    checks,
    score,
    light: lightFor(score),
    goodCount: checks.filter((c) => c.status === 'good').length,
    warningCount: checks.filter((c) => c.status === 'warning').length,
    badCount: checks.filter((c) => c.status === 'bad').length,
    focusKeyword: fields.focusKeyword,
    effectiveTitle: fields.effectiveTitle,
    effectiveDescription: fields.effectiveDescription,
    socialImageUrl: fields.socialImageUrl,
    metaTitle: fields.metaTitle,
    metaDescription: fields.metaDescription,
  }
}
