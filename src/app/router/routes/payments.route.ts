import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'

const PaymentProviderConfigPage = lazyRouteComponent(
  () => import('@domains/payments/pages/PaymentProviderConfigPage'),
  'PaymentProviderConfigPage'
)

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

export const allPaymentsRouteTrees = [...allPaymentProviderConfigRouteTrees]
