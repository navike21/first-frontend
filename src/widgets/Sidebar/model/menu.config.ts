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
  userGroups: {
    es: 'Grupos de usuarios', en: 'User Groups', de: 'Benutzergruppen', fr: 'Groupes d\'utilisateurs',
    pt: 'Grupos de usuários', it: 'Gruppi utenti', ja: 'ユーザーグループ', ko: '사용자 그룹', zh: '用户组', ru: 'Группы пользователей',
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
    {
      id: 'userGroups',
      label: MENU_LABELS.userGroups[lang],
      icon: 'RiShieldUserLine',
      href: navPaths.userGroups(lang),
    },
  ]
}
