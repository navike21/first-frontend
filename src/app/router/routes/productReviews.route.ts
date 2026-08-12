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

const ProductReviewsPage = lazyRouteComponent(
  () => import('@domains/product-reviews/pages/ProductReviewsPage'),
  'ProductReviewsPage'
)
const ProductReviewsTrashPage = lazyRouteComponent(
  () => import('@domains/product-reviews/pages/ProductReviewsTrashPage'),
  'ProductReviewsTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.productReviews[l]))
)

export const allProductReviewsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.productReviews[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.productReviewsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ProductReviewsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const trashSlug = ROUTE_SLUGS.productReviewTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ProductReviewsTrashPage,
          beforeLoad: requirePermission(...CAN.productReviewsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
