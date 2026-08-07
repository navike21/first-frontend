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

const CouponsPage = lazyRouteComponent(
  () => import('@domains/coupons/pages/CouponsPage'),
  'CouponsPage'
)
const CreateCouponPage = lazyRouteComponent(
  () => import('@domains/coupons/pages/CreateCouponPage'),
  'CreateCouponPage'
)
const EditCouponPage = lazyRouteComponent(
  () => import('@domains/coupons/pages/EditCouponPage'),
  'EditCouponPage'
)
const CouponsTrashPage = lazyRouteComponent(
  () => import('@domains/coupons/pages/CouponsTrashPage'),
  'CouponsTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.coupons[l]))
)

export const allCouponsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.coupons[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.couponsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: CouponsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.couponCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateCouponPage,
          beforeLoad: requirePermission(...CAN.couponsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.couponEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$couponId`,
          component: EditCouponPage,
          beforeLoad: requirePermission(...CAN.couponsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.couponTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: CouponsTrashPage,
          beforeLoad: requirePermission(...CAN.couponsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
