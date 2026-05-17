import { createRoute, Outlet } from '@tanstack/react-router'
import { langRoute } from './routes/lang.route'
import { requireAuth, requireGuest } from '@/shared/router/guards'
import { MainLayout } from '@/app/layouts/MainLayout'

export const publicLayout = createRoute({
  component: Outlet,
  id: '_public',
  beforeLoad: requireGuest,
  getParentRoute: () => langRoute,
})

export const privateLayout = createRoute({
  id: '_private',
  beforeLoad: requireAuth,
  component: MainLayout,
  getParentRoute: () => langRoute,
})
