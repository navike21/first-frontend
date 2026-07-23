import type {
  HeaderVariant,
  FooterVariant,
  MapProvider,
} from '../model/site-config.types'

export interface SiteConfigTranslations {
  page: {
    title: string
    description: string
  }
  tabs: {
    header: string
    footer: string
    content: string
    social: string
    maps: string
  }
  social: {
    hint: string
  }
  maps: {
    hint: string
    providerLabel: string
    providers: Record<MapProvider, string>
  }
  actions: {
    save: string
    saved: string
    unsavedHint: string
  }
  header: {
    variantLabel: string
    variants: Record<HeaderVariant, string>
    sticky: string
    transparent: string
    ctaEnabled: string
    ctaLabel: string
    ctaUrl: string
    ctaLinkType: string
    ctaLinkPage: string
    ctaLinkUrl: string
    ctaSelectPage: string
    ctaUsePageTitle: string
    mobileTitle: string
    mobileLogoPosition: string
    mobileMenuIcon: string
    positionLeft: string
    positionCenter: string
    positionRight: string
  }
  footer: {
    variantLabel: string
    variants: Record<FooterVariant, string>
    columns: string
    showSocial: string
    showNewsletter: string
    copyright: string
  }
  content: {
    widthLabel: string
    boxed: string
    boxedHint: string
    full: string
    fullHint: string
    boxedMaxWidth: string
    boxedMaxWidthHint: string
  }
  preview: {
    title: string
    desktop: string
    mobile: string
    sampleMenu: string[]
    sampleCta: string
    sampleNewsletter: string
    sampleCopyright: string
  }
}
