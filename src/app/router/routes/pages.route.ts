import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { PagesPage } from '@domains/pages'
import type { Language } from '@/shared/types/languages'

function createPagesRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.pages[lang],
    component: PagesPage,
    beforeLoad: requirePermission(...CAN.pagesView),
  })
}

const uniqueSlugs = Array.from(new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.pages[l])))

export const allPagesRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => ROUTE_SLUGS.pages[l] === slug)!
  return createPagesRouteTree(lang)
})
