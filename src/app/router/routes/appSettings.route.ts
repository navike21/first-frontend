import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const AppSettingsPage = lazyRouteComponent(() => import('@domains/app-settings'), 'AppSettingsPage')

function createAppSettingsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.appSettings[lang],
    component: AppSettingsPage,
    beforeLoad: requirePermission(...CAN.appSettingsView),
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.appSettings[l]))
)

export const allAppSettingsRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => ROUTE_SLUGS.appSettings[l] === slug
  )!
  return createAppSettingsRouteTree(lang)
})
