import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from './route-slugs'
import type { Language } from '@/shared/types/languages'

function lang(override?: Language): Language {
  return override ?? useLanguageStore.getState().language
}

export const navPaths = {
  home: (l?: Language) => `/${lang(l)}`,

  login: (l?: Language) => `/${lang(l)}/login`,

  users: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.users[l_]}`
  },

  userCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.users[l_]}/${ROUTE_SLUGS.userCreate[l_]}`
  },

  userEdit: (userId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.users[l_]}/${userId}/${ROUTE_SLUGS.userEdit[l_]}`
  },
} as const
