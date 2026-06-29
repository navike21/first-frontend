import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { SubscribersPage } from '@domains/subscribers'
import type { Language } from '@/shared/types/languages'

function createSubscribersRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.subscribers[lang],
    component: SubscribersPage,
    beforeLoad: requirePermission(...CAN.subscribersView),
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.subscribers[l]))
)

export const allSubscribersRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => ROUTE_SLUGS.subscribers[l] === slug
  )!
  return createSubscribersRouteTree(lang)
})
