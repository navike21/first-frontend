import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { PagesPage } from '@domains/pages/pages/PagesPage'
import { CreatePagePage } from '@domains/pages/pages/CreatePagePage'
import { EditPagePage } from '@domains/pages/pages/EditPagePage'
import { PagesTrashPage } from '@domains/pages/pages/PagesTrashPage'
import { PageBuilderPage } from '@domains/pages/pages/PageBuilderPage'
import type { Language } from '@/shared/types/languages'

const parentSlugs = Array.from(new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.pages[l])))

export const allPagesRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter((l: Language) => ROUTE_SLUGS.pages[l] === parentSlug)

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.pagesView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: PagesPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.pageCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreatePagePage,
          beforeLoad: requirePermission(...CAN.pagesCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.pageEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$pageId`,
          component: EditPagePage,
          beforeLoad: requirePermission(...CAN.pagesUpdate),
        })
      )
    }
    const builderSlug = ROUTE_SLUGS.pageBuilder[lang]
    if (!seen.has(`b:${builderSlug}`)) {
      seen.add(`b:${builderSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${builderSlug}/$pageId`,
          component: PageBuilderPage,
          beforeLoad: requirePermission(...CAN.pagesUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.pageTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: PagesTrashPage,
          beforeLoad: requirePermission(...CAN.pagesTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
