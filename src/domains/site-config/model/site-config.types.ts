import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'

export type SiteLocalizedString = Record<Language, string>

export const HEADER_VARIANTS = [
  'logo-left-menu-right',
  'logo-left-menu-center',
  'logo-center-split',
  'logo-center-stacked',
] as const
export type HeaderVariant = (typeof HEADER_VARIANTS)[number]

export const FOOTER_VARIANTS = ['columns', 'centered', 'minimal', 'cta-columns'] as const
export type FooterVariant = (typeof FOOTER_VARIANTS)[number]

export const CONTENT_WIDTHS = ['boxed', 'full'] as const
export type ContentWidth = (typeof CONTENT_WIDTHS)[number]

export interface HeaderConfig {
  variant: HeaderVariant
  sticky: boolean
  transparent: boolean
  cta: {
    enabled: boolean
    /** 'page' = el consumidor usa el título localizado de la página enlazada; 'custom' = usa label. */
    labelMode: 'page' | 'custom'
    label: SiteLocalizedString
    /** 'page' enlaza a una página del CMS por id; 'url' usa el campo url libre. */
    linkType: 'page' | 'url'
    pageId: string | null
    url: string
  }
  mobile: {
    logoPosition: 'left' | 'center'
    menuIconPosition: 'left' | 'right'
  }
}

export interface FooterConfig {
  variant: FooterVariant
  columns: 3 | 4
  showSocial: boolean
  showNewsletter: boolean
  copyright: SiteLocalizedString
}

export interface LayoutConfig {
  contentWidth: ContentWidth
  /** Ancho máximo del contenido en px; solo aplica cuando contentWidth === 'boxed'. */
  boxedMaxWidth: number
}

export const SOCIAL_NETWORKS = [
  'facebook',
  'instagram',
  'x',
  'whatsapp',
  'linkedin',
  'youtube',
  'tiktok',
  'telegram',
  'pinterest',
  'github',
] as const
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]

/** Fuente única de la verdad de las redes sociales del sitio ('' = oculta). */
export type SocialConfig = Record<SocialNetwork, string>

export const MAP_PROVIDERS = ['google', 'osm'] as const
export type MapProvider = (typeof MAP_PROVIDERS)[number]

export interface MapsConfig {
  provider: MapProvider
}

export interface SiteConfigData {
  header: HeaderConfig
  footer: FooterConfig
  layout: LayoutConfig
  social: SocialConfig
  maps: MapsConfig
}

export type SiteConfigUpdatePayload = Partial<SiteConfigData>

// ── Normalización ───────────────────────────────────────────────────────────
// El backend puede devolver documentos antiguos (o la caché offline conservar
// respuestas previas a un deploy) sin categorías/campos nuevos: la UI siempre
// trabaja sobre la config fusionada con estos defaults.

function emptyLocalized(): SiteLocalizedString {
  return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as SiteLocalizedString
}

function emptySocial(): SocialConfig {
  return Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, ''])) as SocialConfig
}

export function siteConfigFallback(): SiteConfigData {
  return {
    header: {
      variant: 'logo-left-menu-right',
      sticky: true,
      transparent: false,
      cta: { enabled: false, labelMode: 'page', label: emptyLocalized(), linkType: 'page', pageId: null, url: '' },
      mobile: { logoPosition: 'left', menuIconPosition: 'right' },
    },
    footer: {
      variant: 'columns',
      columns: 4,
      showSocial: true,
      showNewsletter: false,
      copyright: emptyLocalized(),
    },
    layout: { contentWidth: 'boxed', boxedMaxWidth: 1200 },
    social: emptySocial(),
    maps: { provider: 'google' },
  }
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

export function normalizeSiteConfig(input?: DeepPartial<SiteConfigData> | null): SiteConfigData {
  const base = siteConfigFallback()
  return {
    header: {
      ...base.header,
      ...input?.header,
      cta: { ...base.header.cta, ...input?.header?.cta },
      mobile: { ...base.header.mobile, ...input?.header?.mobile },
    } as SiteConfigData['header'],
    footer: { ...base.footer, ...input?.footer } as SiteConfigData['footer'],
    layout: { ...base.layout, ...input?.layout } as SiteConfigData['layout'],
    social: { ...base.social, ...input?.social } as SocialConfig,
    maps: { ...base.maps, ...input?.maps } as SiteConfigData['maps'],
  }
}
