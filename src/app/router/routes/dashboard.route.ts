import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { NAV } from '@/shared/router'
import { DashboardPage } from '@/pages/Dashboard/ui/DashboardPage'

export const dashboardRoute = createRoute({
  getParentRoute: () => privateLayout,
  path: NAV.home.segment,
  component: DashboardPage,
})
