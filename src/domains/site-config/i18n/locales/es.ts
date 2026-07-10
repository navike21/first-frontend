import type { SiteConfigTranslations } from '../types'

export const es: SiteConfigTranslations = {
  page: {
    title: 'Configuración del sitio web',
    description: 'Define el layout global del sitio público: header, footer y área de contenido',
  },
  tabs: {
    header: 'Header',
    footer: 'Footer',
    content: 'Contenido',
  },
  actions: {
    save: 'Guardar cambios',
    saved: 'Configuración guardada',
    unsavedHint: 'Tienes cambios sin guardar',
  },
  header: {
    variantLabel: 'Layout del header',
    variants: {
      'logo-left-menu-right': 'Logo izquierda · menú derecha',
      'logo-left-menu-center': 'Logo izquierda · menú centrado · CTA',
      'logo-center-split': 'Logo centrado · menú partido',
      'logo-center-stacked': 'Logo arriba · menú debajo',
    },
    sticky: 'Header fijo al hacer scroll',
    transparent: 'Transparente sobre la portada',
    ctaEnabled: 'Botón de llamada a la acción (CTA)',
    ctaLabel: 'Texto del botón',
    ctaUrl: 'URL del botón',
    mobileTitle: 'Comportamiento móvil',
    mobileLogoPosition: 'Posición del logo',
    mobileMenuIcon: 'Lado del icono de menú',
    positionLeft: 'Izquierda',
    positionCenter: 'Centro',
    positionRight: 'Derecha',
  },
  footer: {
    variantLabel: 'Layout del footer',
    variants: {
      columns: 'Multicolumna',
      centered: 'Centrado',
      minimal: 'Minimal',
      'cta-columns': 'CTA + columnas',
    },
    columns: 'Número de columnas',
    showSocial: 'Mostrar redes sociales',
    showNewsletter: 'Mostrar bloque de newsletter',
    copyright: 'Texto de copyright',
  },
  content: {
    widthLabel: 'Ancho del área de contenido',
    boxed: 'Encajonado',
    boxedHint: 'El contenido se centra con un ancho máximo (recomendado)',
    full: 'Ancho completo',
    fullHint: 'El contenido ocupa todo el ancho de la pantalla',
  },
  preview: {
    title: 'Vista previa',
    desktop: 'Escritorio',
    mobile: 'Móvil',
    sampleMenu: ['Inicio', 'Servicios', 'Blog', 'Contacto'],
    sampleCta: 'Contáctanos',
    sampleNewsletter: 'Suscríbete al newsletter',
    sampleCopyright: '© 2026 · Tu marca',
  },
}
