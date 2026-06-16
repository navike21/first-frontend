import type { ErrorTranslations } from '../types'

export const fr: ErrorTranslations = {
  forbidden: {
    heading: 'Accès restreint',
    message:
      "Vous n'avez pas de session active pour accéder à cette page. Veuillez vous connecter pour continuer.",
    loginButton: 'Se connecter',
  },
  notFound: {
    heading: 'Page introuvable',
    message:
      "La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à l'accueil.",
    backButton: 'Page précédente',
    homeButton: "Retour à l'accueil",
    loginButton: 'Se connecter',
  },
}
