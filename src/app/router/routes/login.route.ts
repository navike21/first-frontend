import { createRoute } from '@tanstack/react-router'
import { publicLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { LoginLayout } from '@domains/auth'
import type { Language } from '@/shared/types/languages'

function createLoginRoute(lang: Language) {
  return createRoute({
    getParentRoute: () => publicLayout,
    path: ROUTE_SLUGS.login[lang],
    component: LoginLayout,
  })
}

export const allLoginRouteTrees = SUPPORTED_LANGUAGES.map(createLoginRoute)
