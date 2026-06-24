import type { IconName } from '@/shared/types/icons'
import type { Language } from '@/shared/types/languages'
import { navPaths } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'

export interface MenuChild {
  id: string
  label: string
  href: string
  /** Icon shown for this child in the collapsed rail. */
  icon?: IconName
  /** Required permissions (any-of) to show this item. Omit = always visible. */
  permissions?: readonly string[]
}

export interface MenuItem {
  id: string
  label: string
  icon: IconName
  href?: string
  exact?: boolean
  children?: MenuChild[]
  /** Required permissions (any-of) to show this item. Omit = always visible. */
  permissions?: readonly string[]
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
  business: {
    es: 'Negocio',
    en: 'Business',
    de: 'Geschäft',
    fr: 'Entreprise',
    pt: 'Negócio',
    it: 'Business',
    ja: 'ビジネス',
    ko: '비즈니스',
    zh: '业务',
    ru: 'Бизнес',
  },
  clients: {
    es: 'Clientes',
    en: 'Clients',
    de: 'Kunden',
    fr: 'Clients',
    pt: 'Clientes',
    it: 'Clienti',
    ja: 'クライアント',
    ko: '클라이언트',
    zh: '客户',
    ru: 'Клиенты',
  },
  services: {
    es: 'Servicios',
    en: 'Services',
    de: 'Dienste',
    fr: 'Services',
    pt: 'Serviços',
    it: 'Servizi',
    ja: 'サービス',
    ko: '서비스',
    zh: '服务',
    ru: 'Услуги',
  },
  portfolio: {
    es: 'Portafolio',
    en: 'Portfolio',
    de: 'Portfolio',
    fr: 'Portfolio',
    pt: 'Portfólio',
    it: 'Portfolio',
    ja: 'ポートフォリオ',
    ko: '포트폴리오',
    zh: '作品集',
    ru: 'Портфолио',
  },
  pages: {
    es: 'Páginas',
    en: 'Pages',
    de: 'Seiten',
    fr: 'Pages',
    pt: 'Páginas',
    it: 'Pagine',
    ja: 'ページ',
    ko: '페이지',
    zh: '页面',
    ru: 'Страницы',
  },
  collaborators: {
    es: 'Colaboradores',
    en: 'Collaborators',
    de: 'Mitarbeiter',
    fr: 'Collaborateurs',
    pt: 'Colaboradores',
    it: 'Collaboratori',
    ja: 'コラボレーター',
    ko: '협력자',
    zh: '合作者',
    ru: 'Сотрудники',
  },
  subscribers: {
    es: 'Suscriptores',
    en: 'Subscribers',
    de: 'Abonnenten',
    fr: 'Abonnés',
    pt: 'Assinantes',
    it: 'Iscritti',
    ja: '購読者',
    ko: '구독자',
    zh: '订阅者',
    ru: 'Подписчики',
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
  auditLogs: {
    es: 'Auditoría',
    en: 'Audit Logs',
    de: 'Audit-Logs',
    fr: "Journaux d'audit",
    pt: 'Auditoria',
    it: 'Registri di audit',
    ja: '監査ログ',
    ko: '감사 로그',
    zh: '审计日志',
    ru: 'Логи аудита',
  },
  appSettings: {
    es: 'Configuración',
    en: 'App Settings',
    de: 'Einstellungen',
    fr: 'Paramètres',
    pt: 'Configurações',
    it: 'Impostazioni',
    ja: 'アプリ設定',
    ko: '설정',
    zh: '应用设置',
    ru: 'Настройки',
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
      id: 'business',
      label: MENU_LABELS.business[lang],
      icon: 'RiBuilding4Line',
      children: [
        {
          id: 'clients',
          label: MENU_LABELS.clients[lang],
          href: navPaths.clients(lang),
          icon: 'RiBuilding4Line',
          permissions: CAN.clientsView,
        },
        {
          id: 'services',
          label: MENU_LABELS.services[lang],
          href: navPaths.services(lang),
          icon: 'RiBriefcaseLine',
          permissions: CAN.servicesView,
        },
        {
          id: 'portfolio',
          label: MENU_LABELS.portfolio[lang],
          href: navPaths.portfolio(lang),
          icon: 'RiGalleryLine',
          permissions: CAN.portfolioView,
        },
        {
          id: 'pages',
          label: MENU_LABELS.pages[lang],
          href: navPaths.pages(lang),
          icon: 'RiFileTextLine',
          permissions: CAN.pagesView,
        },
        {
          id: 'collaborators',
          label: MENU_LABELS.collaborators[lang],
          href: navPaths.collaborators(lang),
          icon: 'RiTeamLine',
          permissions: CAN.collaboratorsView,
        },
        {
          id: 'subscribers',
          label: MENU_LABELS.subscribers[lang],
          href: navPaths.subscribers(lang),
          icon: 'RiMailSendLine',
          permissions: CAN.subscribersView,
        },
      ],
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
          permissions: CAN.usersView,
        },
        {
          id: 'userGroups',
          label: MENU_LABELS.userGroups[lang],
          href: navPaths.userGroups(lang),
          icon: 'RiShieldUserLine',
          permissions: CAN.groupsView,
        },
        {
          id: 'auditLogs',
          label: MENU_LABELS.auditLogs[lang],
          href: navPaths.auditLogs(lang),
          icon: 'RiHistoryLine',
          permissions: CAN.auditLogsView,
        },
        {
          id: 'appSettings',
          label: MENU_LABELS.appSettings[lang],
          href: navPaths.appSettings(lang),
          icon: 'RiSettings4Line',
          permissions: CAN.appSettingsView,
        },
      ],
    },
  ]
}
