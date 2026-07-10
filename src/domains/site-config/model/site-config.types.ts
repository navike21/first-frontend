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

export interface SiteConfigData {
  header: HeaderConfig
  footer: FooterConfig
  layout: LayoutConfig
  social: SocialConfig
}

export type SiteConfigUpdatePayload = Partial<SiteConfigData>
