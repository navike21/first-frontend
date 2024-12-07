import { ELanguages } from '@Enums/language'

/**
 * Retrieves the browser's primary language.
 *
 * @returns {string} The primary language code of the browser, extracted from the full language setting.
 * @example
 * getBrowserLanguage() // 'en'
 */
export const getBrowserLanguage = (): ELanguages => {
  const language = navigator.language || navigator.languages[0]
  return language.split('-')[0] as ELanguages
}
