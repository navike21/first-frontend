import type { ErrorTranslations } from '../types'

export const it: ErrorTranslations = {
  forbidden: {
    heading: 'Accesso limitato',
    message:
      'Non hai una sessione attiva per accedere a questa pagina. Accedi per continuare.',
    loginButton: 'Accedi',
  },
  notFound: {
    heading: 'Pagina non trovata',
    message:
      "La pagina che stai cercando non esiste o è stata spostata. Controlla l'URL o torna alla home.",
    backButton: 'Pagina precedente',
    homeButton: 'Vai alla home',
    loginButton: 'Accedi',
  },
}
