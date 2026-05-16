import type { IconName } from '@/shared/types/icons'

export interface NavNode {
  segment: string
  path: string
  label: string
}

export interface NavModule extends NavNode {
  icon: IconName
  shortLabel: string
  description: string
}

// ─── Segments ────────────────────────────────────────────────────────────────
// Each route string lives here exactly once.
// Changing a value propagates automatically to every path, segment, and label.
const SEGMENTS = {
  home: '/',
  login: 'login',
  forbidden: 'no-autorizado',
  notFound: 'no-encontrada',
  clients: 'clientes',
  settings: 'configuracion',
  templates: 'plantillas',
  leaders: 'lideres',
  developers: 'desarrolladores',
} as const

// ─── Navigation tree ─────────────────────────────────────────────────────────
// • segment  → used by TanStack Router createRoute({ path: ... })
// • path     → absolute URL, used by Link href / router.navigate
// • children → settings sub-modules (static, always present)
// Dynamic sidebar entries (client list from API) are NOT here — they are state.
export const NAV = {
  home: {
    segment: SEGMENTS.home,
    path: SEGMENTS.home,
    label: 'Dashboard',
  },
  login: {
    segment: SEGMENTS.login,
    path: `/${SEGMENTS.login}`,
    label: 'Iniciar sesión',
  },
  forbidden: {
    segment: SEGMENTS.forbidden,
    path: `/${SEGMENTS.forbidden}`,
    label: 'Acceso denegado',
  },
  notFound: {
    segment: SEGMENTS.notFound,
    path: `/${SEGMENTS.notFound}`,
    label: 'Página no encontrada',
  },
  clients: {
    segment: SEGMENTS.clients,
    path: `/${SEGMENTS.clients}`,
    icon: 'RiBuilding4Line' as IconName,
    label: 'Clientes',
    shortLabel: 'Clientes',
    description: 'Administrar clientes, asignar líderes  y gestionar desarrolladores por cliente',
  },
  settings: {
    segment: SEGMENTS.settings,
    path: `/${SEGMENTS.settings}`,
    icon: 'RiSettings3Line' as IconName,
    label: 'Configuración',
    children: {
      templates: {
        segment: SEGMENTS.templates,
        path: `/${SEGMENTS.settings}/${SEGMENTS.templates}`,
        icon: 'RiFileList3Line' as IconName,
        label: 'Plantillas de Evaluación',
        shortLabel: 'Plantillas',
        description:
          'Crear y configurar plantillas de evaluación, disponibilizar a clientes específicos',
      },
      leaders: {
        segment: SEGMENTS.leaders,
        path: `/${SEGMENTS.settings}/${SEGMENTS.leaders}`,
        icon: 'RiUserStarLine' as IconName,
        label: 'Líderes ',
        shortLabel: 'Líderes',
        description: 'Crear, editar y administrar líderes , asignar clientes y desarrolladores',
      },
      developers: {
        segment: SEGMENTS.developers,
        path: `/${SEGMENTS.settings}/${SEGMENTS.developers}`,
        icon: 'RiCodeSSlashLine' as IconName,
        label: 'Desarrolladores',
        shortLabel: 'Desarrolladores',
        description:
          'Crear, editar y administrar desarrolladores, asignar skills y gestionar disponibilidad',
      },
    },
  },
} as const
