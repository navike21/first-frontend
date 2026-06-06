import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { NAV } from '@/shared/router'
import { DashboardPage } from '@domains/dashboard'

export const dashboardRoute = createRoute({
  getParentRoute: () => privateLayout,
  path: NAV.home.segment,
  component: DashboardPage,
})
