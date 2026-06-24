import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { ServicesPage } from '@domains/services'
import type { Language } from '@/shared/types/languages'

function createServicesRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.services[lang],
    component: ServicesPage,
    beforeLoad: requirePermission(...CAN.servicesView),
  })
}

const uniqueSlugs = Array.from(new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.services[l])))

export const allServicesRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => ROUTE_SLUGS.services[l] === slug)!
  return createServicesRouteTree(lang)
})
