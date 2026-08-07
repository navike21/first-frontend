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

const ProductsPage = lazyRouteComponent(
  () => import('@domains/products/pages/ProductsPage'),
  'ProductsPage'
)
const CreateProductPage = lazyRouteComponent(
  () => import('@domains/products/pages/CreateProductPage'),
  'CreateProductPage'
)
const EditProductPage = lazyRouteComponent(
  () => import('@domains/products/pages/EditProductPage'),
  'EditProductPage'
)
const ProductsTrashPage = lazyRouteComponent(
  () => import('@domains/products/pages/ProductsTrashPage'),
  'ProductsTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.products[l]))
)

export const allProductsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.products[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.productsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ProductsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.productCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateProductPage,
          beforeLoad: requirePermission(...CAN.productsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.productEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$productId`,
          component: EditProductPage,
          beforeLoad: requirePermission(...CAN.productsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.productTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ProductsTrashPage,
          beforeLoad: requirePermission(...CAN.productsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
