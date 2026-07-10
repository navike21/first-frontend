import type { SiteConfigTranslations } from '../types'

export const en: SiteConfigTranslations = {
  page: {
    title: 'Website configuration',
    description: 'Define the global layout of the public site: header, footer and content area',
  },
  tabs: {
    header: 'Header',
    footer: 'Footer',
    content: 'Content',
  },
  actions: {
    save: 'Save changes',
    saved: 'Configuration saved',
    unsavedHint: 'You have unsaved changes',
  },
  header: {
    variantLabel: 'Header layout',
    variants: {
      'logo-left-menu-right': 'Logo left · menu right',
      'logo-left-menu-center': 'Logo left · centered menu · CTA',
      'logo-center-split': 'Centered logo · split menu',
      'logo-center-stacked': 'Logo on top · menu below',
    },
    sticky: 'Sticky header on scroll',
    transparent: 'Transparent over the hero',
    ctaEnabled: 'Call-to-action button (CTA)',
    ctaLabel: 'Button text',
    ctaUrl: 'Button URL',
    mobileTitle: 'Mobile behavior',
    mobileLogoPosition: 'Logo position',
    mobileMenuIcon: 'Menu icon side',
    positionLeft: 'Left',
    positionCenter: 'Center',
    positionRight: 'Right',
  },
  footer: {
    variantLabel: 'Footer layout',
    variants: {
      columns: 'Multi-column',
      centered: 'Centered',
      minimal: 'Minimal',
      'cta-columns': 'CTA + columns',
    },
    columns: 'Number of columns',
    showSocial: 'Show social links',
    showNewsletter: 'Show newsletter block',
    copyright: 'Copyright text',
  },
  content: {
    widthLabel: 'Content area width',
    boxed: 'Boxed',
    boxedHint: 'Content is centered with a max width (recommended)',
    full: 'Full width',
    fullHint: 'Content spans the full screen width',
  },
  preview: {
    title: 'Preview',
    desktop: 'Desktop',
    mobile: 'Mobile',
    sampleMenu: ['Home', 'Services', 'Blog', 'Contact'],
    sampleCta: 'Contact us',
    sampleNewsletter: 'Subscribe to the newsletter',
    sampleCopyright: '© 2026 · Your brand',
  },
}
