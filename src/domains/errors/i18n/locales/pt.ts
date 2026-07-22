import type { ErrorTranslations } from '../types'

export const pt: ErrorTranslations = {
  forbidden: {
    heading: 'Acesso restrito',
    message:
      'Não tens uma sessão ativa para aceder a esta página. Por favor, inicia sessão para continuar.',
    loginButton: 'Iniciar sessão',
  },
  notFound: {
    heading: 'Página não encontrada',
    message:
      'A página que procuras não existe ou foi movida. Verifica o URL ou regressa ao início.',
    backButton: 'Página anterior',
    homeButton: 'Ir ao início',
    loginButton: 'Iniciar sessão',
  },
  serverError: {
    heading: 'Erro do servidor',
    message:
      'Ocorreu um erro inesperado no servidor. Já estamos a investigar — tenta novamente em alguns minutos.',
    retryButton: 'Tentar novamente',
  },
}
