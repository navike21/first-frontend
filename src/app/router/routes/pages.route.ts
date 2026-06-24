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

export const allPagesRouteTrees = SUPPORTED_LANGUAGES.map(createPagesRouteTree)
