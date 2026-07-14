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
    return `/${l_}/${ROUTE_SLUGS.users[l_]}/${ROUTE_SLUGS.userEdit[l_]}/${userId}`
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
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${ROUTE_SLUGS.userGroupEdit[l_]}/${groupId}`
  },

  userGroupUsers: (groupId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${ROUTE_SLUGS.userGroupUsers[l_]}/${groupId}`
  },

  userGroupTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.userGroups[l_]}/${ROUTE_SLUGS.userGroupTrash[l_]}`
  },
  clients: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.clients[l_]}`
  },
  clientCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.clients[l_]}/${ROUTE_SLUGS.clientCreate[l_]}`
  },
  clientEdit: (clientId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.clients[l_]}/${ROUTE_SLUGS.clientEdit[l_]}/${clientId}`
  },
  clientTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.clients[l_]}/${ROUTE_SLUGS.clientTrash[l_]}`
  },
  services: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.services[l_]}`
  },
  serviceCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.services[l_]}/${ROUTE_SLUGS.serviceCreate[l_]}`
  },
  serviceEdit: (serviceId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.services[l_]}/${ROUTE_SLUGS.serviceEdit[l_]}/${serviceId}`
  },
  serviceTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.services[l_]}/${ROUTE_SLUGS.serviceTrash[l_]}`
  },
  portfolio: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.portfolio[l_]}`
  },
  portfolioCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.portfolio[l_]}/${ROUTE_SLUGS.portfolioCreate[l_]}`
  },
  portfolioEdit: (portfolioId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.portfolio[l_]}/${ROUTE_SLUGS.portfolioEdit[l_]}/${portfolioId}`
  },
  portfolioTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.portfolio[l_]}/${ROUTE_SLUGS.portfolioTrash[l_]}`
  },
  pages: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}`
  },
  pageCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}/${ROUTE_SLUGS.pageCreate[l_]}`
  },
  pageEdit: (pageId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}/${ROUTE_SLUGS.pageEdit[l_]}/${pageId}`
  },
  pageBuilder: (pageId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}/${ROUTE_SLUGS.pageBuilder[l_]}/${pageId}`
  },
  pageTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.pages[l_]}/${ROUTE_SLUGS.pageTrash[l_]}`
  },
  categories: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.categories[l_]}`
  },
  categoryCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.categories[l_]}/${ROUTE_SLUGS.categoryCreate[l_]}`
  },
  categoryEdit: (categoryId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.categories[l_]}/${ROUTE_SLUGS.categoryEdit[l_]}/${categoryId}`
  },
  categoryTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.categories[l_]}/${ROUTE_SLUGS.categoryTrash[l_]}`
  },
  tags: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.tags[l_]}`
  },
  tagCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.tags[l_]}/${ROUTE_SLUGS.tagCreate[l_]}`
  },
  tagEdit: (tagId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.tags[l_]}/${ROUTE_SLUGS.tagEdit[l_]}/${tagId}`
  },
  tagTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.tags[l_]}/${ROUTE_SLUGS.tagTrash[l_]}`
  },
  siteConfig: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.siteConfig[l_]}`
  },
  media: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.media[l_]}`
  },
  mediaTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.media[l_]}/${ROUTE_SLUGS.mediaTrash[l_]}`
  },
  collaborators: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.collaborators[l_]}`
  },
  collaboratorCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.collaborators[l_]}/${ROUTE_SLUGS.collaboratorCreate[l_]}`
  },
  collaboratorEdit: (collaboratorId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.collaborators[l_]}/${ROUTE_SLUGS.collaboratorEdit[l_]}/${collaboratorId}`
  },
  collaboratorTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.collaborators[l_]}/${ROUTE_SLUGS.collaboratorTrash[l_]}`
  },
  subscribers: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.subscribers[l_]}`
  },
  subscriberCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.subscribers[l_]}/${ROUTE_SLUGS.subscriberCreate[l_]}`
  },
  subscriberEdit: (subscriberId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.subscribers[l_]}/${ROUTE_SLUGS.subscriberEdit[l_]}/${subscriberId}`
  },
  subscriberTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.subscribers[l_]}/${ROUTE_SLUGS.subscriberTrash[l_]}`
  },
  forms: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forms[l_]}`
  },
  formCreate: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forms[l_]}/${ROUTE_SLUGS.formCreate[l_]}`
  },
  formEdit: (formId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forms[l_]}/${ROUTE_SLUGS.formEdit[l_]}/${formId}`
  },
  formTrash: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forms[l_]}/${ROUTE_SLUGS.formTrash[l_]}`
  },
  formSubmissions: (formId: string, l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.forms[l_]}/${ROUTE_SLUGS.formSubmissions[l_]}/${formId}`
  },
  auditLogs: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.auditLogs[l_]}`
  },
  appSettings: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.appSettings[l_]}`
  },
  profile: (l?: Language) => {
    const l_ = lang(l)
    return `/${l_}/${ROUTE_SLUGS.profile[l_]}`
  },
} as const
