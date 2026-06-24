import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { ClientsPage } from '@domains/clients'
import type { Language } from '@/shared/types/languages'

function createClientsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.clients[lang],
    component: ClientsPage,
    beforeLoad: requirePermission(...CAN.clientsView),
  })
}

export const allClientsRouteTrees = SUPPORTED_LANGUAGES.map(createClientsRouteTree)
