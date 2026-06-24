import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from './route-slugs'
import type { Language } from '@/shared/types/languages'

function lang(override?: Language): Language {
  return override ?? useLanguageStore.getState().language
}

export const navPaths = {
  home: (l?: Language) => `/${lang(l)}`,

  login: (l?: Language) => `/${lang(l)}/login`,

  forbidden: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forbidden[l_]}`
  },

  notFound: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.notFound[l_]}`
  },

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

  userTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.users[l_]}/${ROUTE_SLUGS.userTrash[l_]}`
  },

  userGroups: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}`
  },

  userGroupCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${ROUTE_SLUGS.userGroupCreate[l_]}`
  },

  userGroupEdit: (groupId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${groupId}/${ROUTE_SLUGS.userGroupEdit[l_]}`
  },

  userGroupUsers: (groupId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${groupId}/${ROUTE_SLUGS.userGroupUsers[l_]}`
  },

  userGroupTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${ROUTE_SLUGS.userGroupTrash[l_]}`
  },
  clients: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.clients[l_]}`
  },
  services: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.services[l_]}`
  },
  portfolio: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.portfolio[l_]}`
  },
  pages: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}`
  },
  collaborators: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.collaborators[l_]}`
  },
  subscribers: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.subscribers[l_]}`
  },
  auditLogs: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.auditLogs[l_]}`
  },
  appSettings: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.appSettings[l_]}`
  },
} as const
