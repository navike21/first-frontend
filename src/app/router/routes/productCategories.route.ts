import {
  createRoute,
  lazyRouteComponent,
  Outlet,
  type AnyRoute,
} from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const ProductCategoriesPage = lazyRouteComponent(
  () => import('@domains/product-categories/pages/ProductCategoriesPage'),
  'ProductCategoriesPage'
)
const CreateProductCategoryPage = lazyRouteComponent(
  () => import('@domains/product-categories/pages/CreateProductCategoryPage'),
  'CreateProductCategoryPage'
)
const EditProductCategoryPage = lazyRouteComponent(
  () => import('@domains/product-categories/pages/EditProductCategoryPage'),
  'EditProductCategoryPage'
)
const ProductCategoriesTrashPage = lazyRouteComponent(
  () => import('@domains/product-categories/pages/ProductCategoriesTrashPage'),
  'ProductCategoriesTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.productCategories[l]))
)

export const allProductCategoriesRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.productCategories[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.productCategoriesView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ProductCategoriesPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.productCategoryCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateProductCategoryPage,
          beforeLoad: requirePermission(...CAN.productCategoriesCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.productCategoryEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$categoryId`,
          component: EditProductCategoryPage,
          beforeLoad: requirePermission(...CAN.productCategoriesUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.productCategoryTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ProductCategoriesTrashPage,
          beforeLoad: requirePermission(...CAN.productCategoriesTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
