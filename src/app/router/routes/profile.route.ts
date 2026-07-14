import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import type { Language } from '@/shared/types/languages'

const ProfilePage = lazyRouteComponent(() => import('@domains/users'), 'ProfilePage')

function createProfileRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.profile[lang],
    component: ProfilePage,
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.profile[l]))
)

export const allProfileRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => ROUTE_SLUGS.profile[l] === slug)!
  return createProfileRouteTree(lang)
})
