import type { ErrorTranslations } from '../types'

export const de: ErrorTranslations = {
  forbidden: {
    heading: 'Zugriff beschränkt',
    message:
      'Du hast keine aktive Sitzung, um auf diese Seite zuzugreifen. Bitte melde dich an, um fortzufahren.',
    loginButton: 'Anmelden',
  },
  notFound: {
    heading: 'Seite nicht gefunden',
    message:
      'Die gesuchte Seite existiert nicht oder wurde verschoben. Überprüfe die URL oder gehe zur Startseite.',
    backButton: 'Vorherige Seite',
    homeButton: 'Zur Startseite',
    loginButton: 'Anmelden',
  },
  serverError: {
    heading: 'Serverfehler',
    message:
      'Ein unerwarteter Serverfehler ist aufgetreten. Wir kümmern uns bereits darum — versuche es in ein paar Minuten erneut.',
    retryButton: 'Erneut versuchen',
  },
}
