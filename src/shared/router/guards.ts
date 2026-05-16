import { redirect } from '@tanstack/react-router'
import { isTokenStored } from '@/shared/model'

/**
 * Use in `beforeLoad` on private routes.
 * Redirects unauthenticated users to /403.
 *
 * @example
 * export const dashboardRoute = createRoute({
 *   getParentRoute: () => rootRoute,
 *   path: '/dashboard',
 *   beforeLoad: requireAuth,
 *   component: Dashboard,
 * })
 */
export const requireAuth = (): void => {
  if (!isTokenStored()) {
    throw redirect({ to: '/no-autorizado' })
  }
}

/**
 * Use in `beforeLoad` on public-only routes (e.g. /login).
 * Redirects already-authenticated users to /.
 *
 * @example
 * export const loginRoute = createRoute({
 *   getParentRoute: () => rootRoute,
 *   path: '/login',
 *   beforeLoad: requireGuest,
 *   component: LoginLayout,
 * })
 */
export const requireGuest = (): void => {
  if (isTokenStored()) {
    throw redirect({ to: '/' })
  }
}
