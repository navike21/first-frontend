import { createRoute } from '@tanstack/react-router'
import { langRoute } from './lang.route'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { ServerErrorPage } from '@domains/errors'
import type { Language } from '@/shared/types/languages'

function createServerErrorRoute(lang: Language) {
  return createRoute({
    getParentRoute: () => langRoute,
    path: ROUTE_SLUGS.serverError[lang],
    component: ServerErrorPage,
  })
}

export const allServerErrorRouteTrees = SUPPORTED_LANGUAGES.map(
  createServerErrorRoute
)
