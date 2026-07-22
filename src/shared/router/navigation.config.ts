// Route segments and absolute paths for first-frontend.
// Add new module entries here as each module is built.

const SEGMENTS = {
  home: '/',
  // Slug fijo (no traducido) — lo genera el backend dentro del email de
  // recuperación de contraseña; ver shared/router/nav-paths.ts.
  resetPassword: 'reset-password',
  users: 'usuarios',
  userCreate: 'usuarios/nuevo',
  userGroups: 'grupos',
  userGroupCreate: 'grupos/nuevo',
  forbidden: 'no-autorizado',
  notFound: 'no-encontrada',
} as const

export const NAV = {
  home: {
    segment: SEGMENTS.home,
    path: SEGMENTS.home,
    label: 'Dashboard',
  },
  resetPassword: {
    segment: SEGMENTS.resetPassword,
    path: `/${SEGMENTS.resetPassword}`,
    label: 'Restablecer contraseña',
  },
  users: {
    segment: SEGMENTS.users,
    path: `/${SEGMENTS.users}`,
    label: 'Usuarios',
  },
  userCreate: {
    segment: 'nuevo',
    path: `/${SEGMENTS.userCreate}`,
    label: 'Nuevo usuario',
  },
  userGroups: {
    segment: SEGMENTS.userGroups,
    path: `/${SEGMENTS.userGroups}`,
    label: 'Grupos de usuarios',
  },
  userGroupCreate: {
    segment: 'nuevo',
    path: `/${SEGMENTS.userGroupCreate}`,
    label: 'Nuevo grupo',
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
} as const

export type NavNode = {
  readonly segment: string
  readonly path: string
  readonly label: string
}

export type NavModule = typeof NAV
