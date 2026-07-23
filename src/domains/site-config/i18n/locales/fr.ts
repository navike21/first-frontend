import type { SiteConfigTranslations } from '../types'

export const fr: SiteConfigTranslations = {
  page: {
    title: 'Configuration du site web',
    description:
      'Définissez le layout global du site public : header, footer et zone de contenu',
  },
  tabs: {
    header: 'Header',
    footer: 'Footer',
    content: 'Contenu',
    social: 'Réseaux sociaux',
    maps: 'Cartes',
  },
  social: {
    hint: 'Source unique de vérité : ces URLs alimentent toutes les sections du site public. Laissez vides les réseaux inutilisés.',
  },
  maps: {
    hint: 'Choisissez le fournisseur de cartes que le site public utilisera.',
    providerLabel: 'Fournisseur de cartes',
    providers: {
      google: 'Google Maps',
      osm: 'OpenStreetMap',
    },
  },
  actions: {
    save: 'Enregistrer les modifications',
    saved: 'Configuration enregistrée',
    unsavedHint: 'Vous avez des modifications non enregistrées',
  },
  header: {
    variantLabel: 'Layout du header',
    variants: {
      'logo-left-menu-right': 'Logo à gauche · menu à droite',
      'logo-left-menu-center': 'Logo à gauche · menu centré · CTA',
      'logo-center-split': 'Logo centré · menu partagé',
      'logo-center-stacked': 'Logo en haut · menu dessous',
    },
    sticky: 'Header fixe au défilement',
    transparent: 'Transparent sur le hero',
    ctaEnabled: "Bouton d'appel à l'action (CTA)",
    ctaLabel: 'Texte du bouton',
    ctaUrl: 'URL du bouton',
    ctaLinkType: 'Destination du bouton',
    ctaLinkPage: 'Page du site',
    ctaLinkUrl: 'URL personnalisée',
    ctaSelectPage: 'Sélectionner une page…',
    ctaUsePageTitle: 'Utiliser le titre de la page comme texte du bouton',
    mobileTitle: 'Comportement mobile',
    mobileLogoPosition: 'Position du logo',
    mobileMenuIcon: "Côté de l'icône de menu",
    positionLeft: 'Gauche',
    positionCenter: 'Centre',
    positionRight: 'Droite',
  },
  footer: {
    variantLabel: 'Layout du footer',
    variants: {
      columns: 'Multi-colonnes',
      centered: 'Centré',
      minimal: 'Minimal',
      'cta-columns': 'CTA + colonnes',
    },
    columns: 'Nombre de colonnes',
    showSocial: 'Afficher les réseaux sociaux',
    showNewsletter: 'Afficher le bloc newsletter',
    copyright: 'Texte de copyright',
  },
  content: {
    widthLabel: 'Largeur de la zone de contenu',
    boxed: 'Encadré',
    boxedHint: 'Le contenu est centré avec une largeur maximale (recommandé)',
    full: 'Pleine largeur',
    fullHint: "Le contenu occupe toute la largeur de l'écran",
    boxedMaxWidth: 'Largeur maximale (px)',
    boxedMaxWidthHint: 'Entre 640 et 1920 px',
  },
  preview: {
    title: 'Aperçu',
    desktop: 'Bureau',
    mobile: 'Mobile',
    sampleMenu: ['Accueil', 'Services', 'Blog', 'Contact'],
    sampleCta: 'Contactez-nous',
    sampleNewsletter: "S'abonner à la newsletter",
    sampleCopyright: '© 2026 · Votre marque',
  },
}
