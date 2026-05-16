import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../root'
import { NAV } from '@/shared/router'
import { NotFoundPage } from '@/features/errors'

export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NAV.notFound.segment,
  component: NotFoundPage,
})
