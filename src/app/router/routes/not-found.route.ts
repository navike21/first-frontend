import { createRoute } from '@tanstack/react-router'
import { langRoute } from './lang.route'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { NotFoundPage } from '@/features/errors/not-found/ui/NotFoundPage'
import type { Language } from '@/shared/types/languages'

function createNotFoundRoute(lang: Language) {
  return createRoute({
    getParentRoute: () => langRoute,
    path: ROUTE_SLUGS.notFound[lang],
    component: NotFoundPage,
  })
}

export const allNotFoundRouteTrees = SUPPORTED_LANGUAGES.map(createNotFoundRoute)
