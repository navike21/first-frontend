import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { PortfolioPage } from '@domains/portfolio'
import type { Language } from '@/shared/types/languages'

function createPortfolioRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.portfolio[lang],
    component: PortfolioPage,
    beforeLoad: requirePermission(...CAN.portfolioView),
  })
}

export const allPortfolioRouteTrees = SUPPORTED_LANGUAGES.map(createPortfolioRouteTree)
