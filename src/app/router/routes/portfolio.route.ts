import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { PortfolioPage } from '@domains/portfolio/pages/PortfolioPage'
import { CreatePortfolioPage } from '@domains/portfolio/pages/CreatePortfolioPage'
import { EditPortfolioPage } from '@domains/portfolio/pages/EditPortfolioPage'
import { PortfolioTrashPage } from '@domains/portfolio/pages/PortfolioTrashPage'
import type { Language } from '@/shared/types/languages'

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.portfolio[l]))
)

export const allPortfolioRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.portfolio[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.portfolioView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: PortfolioPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.portfolioCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreatePortfolioPage,
          beforeLoad: requirePermission(...CAN.portfolioCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.portfolioEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$portfolioSlug`,
          component: EditPortfolioPage,
          beforeLoad: requirePermission(...CAN.portfolioUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.portfolioTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: PortfolioTrashPage,
          beforeLoad: requirePermission(...CAN.portfolioTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
