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

const OrdersPage = lazyRouteComponent(
  () => import('@domains/orders/pages/OrdersPage'),
  'OrdersPage'
)
const CreateOrderPage = lazyRouteComponent(
  () => import('@domains/orders/pages/CreateOrderPage'),
  'CreateOrderPage'
)
const OrderDetailPage = lazyRouteComponent(
  () => import('@domains/orders/pages/OrderDetailPage'),
  'OrderDetailPage'
)
const OrdersTrashPage = lazyRouteComponent(
  () => import('@domains/orders/pages/OrdersTrashPage'),
  'OrdersTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.orders[l]))
)

export const allOrdersRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.orders[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.ordersView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: OrdersPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.orderCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateOrderPage,
          beforeLoad: requirePermission(...CAN.ordersCreate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.orderTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: OrdersTrashPage,
          beforeLoad: requirePermission(...CAN.ordersTrash),
        })
      )
    }
  }

  // Detail route: bare `/orders/$orderId`, no verb-prefix slug — orders have
  // no full "edit" (only status/payment-status transitions, handled inline
  // on this same page), so there's nothing to disambiguate against besides
  // the `create`/`trash` slugs above (registered first, so they win over the
  // dynamic `$orderId` segment for an exact string match).
  children.push(
    createRoute({
      getParentRoute: () => layout,
      path: '$orderId',
      component: OrderDetailPage,
      beforeLoad: requirePermission(...CAN.ordersView),
    })
  )

  return layout.addChildren(children)
})
