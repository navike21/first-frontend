import type { ErrorTranslations } from '../types'

export const ru: ErrorTranslations = {
  forbidden: {
    heading: 'Доступ ограничен',
    message: 'У вас нет активной сессии для доступа к этой странице. Пожалуйста, войдите, чтобы продолжить.',
    loginButton: 'Войти',
  },
  notFound: {
    heading: 'Страница не найдена',
    message: 'Страница, которую вы ищете, не существует или была перемещена. Проверьте URL или вернитесь на главную.',
    backButton: 'Предыдущая страница',
    homeButton: 'На главную',
    loginButton: 'Войти',
  },
}
