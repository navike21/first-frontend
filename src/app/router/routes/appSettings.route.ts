import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { AppSettingsPage } from '@domains/app-settings'
import type { Language } from '@/shared/types/languages'

function createAppSettingsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.appSettings[lang],
    component: AppSettingsPage,
    beforeLoad: requirePermission(...CAN.appSettingsView),
  })
}

export const allAppSettingsRouteTrees = SUPPORTED_LANGUAGES.map(createAppSettingsRouteTree)
