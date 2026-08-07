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

const CustomersPage = lazyRouteComponent(
  () => import('@domains/customers/pages/CustomersPage'),
  'CustomersPage'
)
const CreateCustomerPage = lazyRouteComponent(
  () => import('@domains/customers/pages/CreateCustomerPage'),
  'CreateCustomerPage'
)
const EditCustomerPage = lazyRouteComponent(
  () => import('@domains/customers/pages/EditCustomerPage'),
  'EditCustomerPage'
)
const CustomersTrashPage = lazyRouteComponent(
  () => import('@domains/customers/pages/CustomersTrashPage'),
  'CustomersTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.customers[l]))
)

export const allCustomersRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.customers[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.customersView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: CustomersPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.customerCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateCustomerPage,
          beforeLoad: requirePermission(...CAN.customersCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.customerEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$customerId`,
          component: EditCustomerPage,
          beforeLoad: requirePermission(...CAN.customersUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.customerTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: CustomersTrashPage,
          beforeLoad: requirePermission(...CAN.customersTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
