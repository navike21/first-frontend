import type { ErrorTranslations } from '../types'

export const es: ErrorTranslations = {
  forbidden: {
    heading: 'Acceso restringido',
    message:
      'No tienes una sesión activa para acceder a esta página. Por favor, inicia sesión para continuar.',
    loginButton: 'Iniciar sesión',
  },
  notFound: {
    heading: 'Página no encontrada',
    message:
      'La página que buscas no existe o fue movida. Verifica la URL o regresa al inicio.',
    backButton: 'Página anterior',
    homeButton: 'Ir al inicio',
    loginButton: 'Iniciar sesión',
  },
}
