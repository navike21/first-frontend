import { createRoute, Outlet } from '@tanstack/react-router'
import { rootRoute } from './root'
import { requireAuth, requireGuest } from '@/shared/router/guards'
import { MainLayout } from '@/app/layouts/MainLayout'

/**
 * Route group for public pages (login, forgot-password, etc.).
 * Redirects to "/" if the user already has an active session.
 */
export const publicLayout = createRoute({
  component: Outlet,
  id: '_public',
  beforeLoad: requireGuest,
  getParentRoute: () => rootRoute,
})

/**
 * Route group for protected pages (dashboard, profile, etc.).
 * Redirects to "/no-autorizado" if there is no active session.
 */
export const privateLayout = createRoute({
  id: '_private',
  beforeLoad: requireAuth,
  component: MainLayout,
  getParentRoute: () => rootRoute,
})
