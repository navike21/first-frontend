import type { Language } from '@/shared/types/languages'

export interface Translations {
  language: {
    label: string
    names: Record<Language, string>
  }
  header: {
    expandMenu: string
    collapseMenu: string
    userMenu: string
    guestName: string
    guestEmail: string
  }
  profileDrawer: {
    title: string
    accountSettings: string
    logout: string
  }
}
