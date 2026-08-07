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

const PaymentMethodsPage = lazyRouteComponent(
  () => import('@domains/payments/pages/PaymentMethodsPage'),
  'PaymentMethodsPage'
)
const CreatePaymentMethodPage = lazyRouteComponent(
  () => import('@domains/payments/pages/CreatePaymentMethodPage'),
  'CreatePaymentMethodPage'
)
const EditPaymentMethodPage = lazyRouteComponent(
  () => import('@domains/payments/pages/EditPaymentMethodPage'),
  'EditPaymentMethodPage'
)
const PaymentMethodsTrashPage = lazyRouteComponent(
  () => import('@domains/payments/pages/PaymentMethodsTrashPage'),
  'PaymentMethodsTrashPage'
)
const PaymentProviderConfigPage = lazyRouteComponent(
  () => import('@domains/payments/pages/PaymentProviderConfigPage'),
  'PaymentProviderConfigPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.paymentMethods[l]))
)

const allPaymentMethodsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.paymentMethods[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.paymentMethodsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: PaymentMethodsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.paymentMethodCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreatePaymentMethodPage,
          beforeLoad: requirePermission(...CAN.paymentMethodsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.paymentMethodEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$methodId`,
          component: EditPaymentMethodPage,
          beforeLoad: requirePermission(...CAN.paymentMethodsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.paymentMethodTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: PaymentMethodsTrashPage,
          beforeLoad: requirePermission(...CAN.paymentMethodsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})

const providerConfigSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.paymentProviderConfig[l]))
)

const allPaymentProviderConfigRouteTrees = providerConfigSlugs.map((slug) =>
  createRoute({
    getParentRoute: () => privateLayout,
    path: slug,
    component: PaymentProviderConfigPage,
    beforeLoad: requirePermission(...CAN.paymentProviderConfigView),
  })
)

export const allPaymentsRouteTrees = [
  ...allPaymentMethodsRouteTrees,
  ...allPaymentProviderConfigRouteTrees,
]
