import { createTranslations } from '@/shared/i18n'
import { es } from './locales/es'
import { en } from './locales/en'
import { de } from './locales/de'
import { fr } from './locales/fr'
import { pt } from './locales/pt'
import { it } from './locales/it'
import { ja } from './locales/ja'
import { ko } from './locales/ko'
import { zh } from './locales/zh'
import { ru } from './locales/ru'

export type { UserGroupsTranslations } from './types'

export const useUserGroupsTranslation = createTranslations({
  es, en, de, fr, pt, it, ja, ko, zh, ru,
})
