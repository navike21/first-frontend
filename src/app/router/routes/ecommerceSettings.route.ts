import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const EcommerceSettingsPage = lazyRouteComponent(
  () => import('@domains/ecommerce-settings'),
  'EcommerceSettingsPage'
)

function createEcommerceSettingsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.ecommerceSettings[lang],
    component: EcommerceSettingsPage,
    beforeLoad: requirePermission(...CAN.ecommerceSettingsView),
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.ecommerceSettings[l]))
)

export const allEcommerceSettingsRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => ROUTE_SLUGS.ecommerceSettings[l] === slug
  )!
  return createEcommerceSettingsRouteTree(lang)
})
