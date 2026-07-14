import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { NAV } from '@/shared/router'

const DashboardPage = lazyRouteComponent(() => import('@domains/dashboard'), 'DashboardPage')

export const dashboardRoute = createRoute({
  getParentRoute: () => privateLayout,
  path: NAV.home.segment,
  component: DashboardPage,
})
