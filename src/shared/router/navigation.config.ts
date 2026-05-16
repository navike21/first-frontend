// Route segments and absolute paths for first-frontend.
// Add new module entries here as each module is built.

const SEGMENTS = {
  home: '/',
  login: 'login',
  users: 'usuarios',
  userCreate: 'usuarios/nuevo',
  forbidden: 'no-autorizado',
  notFound: 'no-encontrada',
} as const

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
