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

export const allServicesRouteTrees = SUPPORTED_LANGUAGES.map(createServicesRouteTree)
