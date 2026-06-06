import { createRoute } from '@tanstack/react-router'
import { langRoute } from './lang.route'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { ForbiddenPage } from '@domains/errors'
import type { Language } from '@/shared/types/languages'

function createForbiddenRoute(lang: Language) {
  return createRoute({
    getParentRoute: () => langRoute,
    path: ROUTE_SLUGS.forbidden[lang],
    component: ForbiddenPage,
  })
}

export const allForbiddenRouteTrees = SUPPORTED_LANGUAGES.map(createForbiddenRoute)
