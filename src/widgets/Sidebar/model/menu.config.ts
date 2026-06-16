import type { IconName } from '@/shared/types/icons'
import type { Language } from '@/shared/types/languages'
import { navPaths } from '@/shared/router'

export interface MenuChild {
  id: string
  label: string
  href: string
  /** Icon shown for this child in the collapsed rail. */
  icon?: IconName
}

export interface MenuItem {
  id: string
  label: string
  icon: IconName
  href?: string
  exact?: boolean
  children?: MenuChild[]
}

const MENU_LABELS: Record<string, Record<Language, string>> = {
  dashboard: {
    es: 'Dashboard',
    en: 'Dashboard',
    de: 'Dashboard',
    fr: 'Tableau de bord',
    pt: 'Painel',
    it: 'Dashboard',
    ja: 'ダッシュボード',
    ko: '대시보드',
    zh: '仪表板',
    ru: 'Панель',
  },
  administration: {
    es: 'Administración',
    en: 'Administration',
    de: 'Verwaltung',
    fr: 'Administration',
    pt: 'Administração',
    it: 'Amministrazione',
    ja: '管理',
    ko: '관리',
    zh: '管理',
    ru: 'Администрирование',
  },
  users: {
    es: 'Usuarios',
    en: 'Users',
    de: 'Benutzer',
    fr: 'Utilisateurs',
    pt: 'Usuários',
    it: 'Utenti',
    ja: 'ユーザー',
    ko: '사용자',
    zh: '用户',
    ru: 'Пользователи',
  },
  userGroups: {
    es: 'Grupos de usuarios',
    en: 'User Groups',
    de: 'Benutzergruppen',
    fr: "Groupes d'utilisateurs",
    pt: 'Grupos de usuários',
    it: 'Gruppi utenti',
    ja: 'ユーザーグループ',
    ko: '사용자 그룹',
    zh: '用户组',
    ru: 'Группы пользователей',
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
      id: 'administration',
      label: MENU_LABELS.administration[lang],
      icon: 'RiSettings3Line',
      children: [
        {
          id: 'users',
          label: MENU_LABELS.users[lang],
          href: navPaths.users(lang),
          icon: 'RiGroupLine',
        },
        {
          id: 'userGroups',
          label: MENU_LABELS.userGroups[lang],
          href: navPaths.userGroups(lang),
          icon: 'RiShieldUserLine',
        },
      ],
    },
  ]
}
