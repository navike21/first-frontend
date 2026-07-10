import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { CategoriesPage } from '@domains/categories/pages/CategoriesPage'
import { CreateCategoryPage } from '@domains/categories/pages/CreateCategoryPage'
import { EditCategoryPage } from '@domains/categories/pages/EditCategoryPage'
import { CategoriesTrashPage } from '@domains/categories/pages/CategoriesTrashPage'
import type { Language } from '@/shared/types/languages'

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.categories[l]))
)

export const allCategoriesRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.categories[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.categoriesView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: CategoriesPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.categoryCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateCategoryPage,
          beforeLoad: requirePermission(...CAN.categoriesCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.categoryEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$categoryId`,
          component: EditCategoryPage,
          beforeLoad: requirePermission(...CAN.categoriesUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.categoryTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: CategoriesTrashPage,
          beforeLoad: requirePermission(...CAN.categoriesTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
