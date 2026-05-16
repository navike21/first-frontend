import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../root'
import { NAV } from '@/shared/router'
import { ForbiddenPage } from '@/features/errors/forbidden/ui/ForbiddenPage'

export const forbiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NAV.forbidden.segment,
  component: ForbiddenPage,
})
