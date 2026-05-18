import type { ErrorTranslations } from '../types'

export const en: ErrorTranslations = {
  forbidden: {
    heading: 'Access Restricted',
    message: "You don't have an active session to access this page. Please sign in to continue.",
    loginButton: 'Sign in',
  },
  notFound: {
    heading: 'Page Not Found',
    message: "The page you're looking for doesn't exist or was moved. Check the URL or go back to the home page.",
    backButton: 'Previous page',
    homeButton: 'Go home',
    loginButton: 'Sign in',
  },
}
