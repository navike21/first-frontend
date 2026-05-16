export const SUPPORTED_LANGUAGES = [
  'es',
  'en',
  'de',
  'fr',
  'it',
  'ja',
  'ko',
  'pt',
  'zh',
  'ru',
] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]
