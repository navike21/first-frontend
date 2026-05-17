import type { IconName } from '@/shared/types/icons'
import type { Language } from '@/shared/types/languages'
import { navPaths } from '@/shared/router'

export interface MenuItem {
  id: string
  label: string
  icon: IconName
  href?: string
  exact?: boolean
  children?: {
    id: string
    label: string
    href: string
  }[]
}

const MENU_LABELS: Record<string, Record<Language, string>> = {
  dashboard: {
    es: 'Dashboard', en: 'Dashboard', de: 'Dashboard', fr: 'Tableau de bord',
    pt: 'Painel', it: 'Dashboard', ja: 'ダッシュボード', ko: '대시보드', zh: '仪表板', ru: 'Панель',
  },
  users: {
    es: 'Usuarios', en: 'Users', de: 'Benutzer', fr: 'Utilisateurs',
    pt: 'Usuários', it: 'Utenti', ja: 'ユーザー', ko: '사용자', zh: '用户', ru: 'Пользователи',
  },
}

export function getMenuConfig(lang: Language): MenuItem[] {
  return [
    {
      id: 'dashboard',
      label: MENU_LABELS.dashboard[lang],
      icon: 'RiDashboard2Line',
      href: navPaths.home(lang),
      exact: true,
    },
    {
      id: 'users',
      label: MENU_LABELS.users[lang],
      icon: 'RiGroupLine',
      href: navPaths.users(lang),
    },
  ]
}
