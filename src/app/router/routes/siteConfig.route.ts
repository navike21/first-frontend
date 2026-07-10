import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { SiteConfigPage } from '@domains/site-config'
import type { Language } from '@/shared/types/languages'

function createSiteConfigRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.siteConfig[lang],
    component: SiteConfigPage,
    beforeLoad: requirePermission(...CAN.siteConfigView),
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.siteConfig[l]))
)

export const allSiteConfigRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => ROUTE_SLUGS.siteConfig[l] === slug
  )!
  return createSiteConfigRouteTree(lang)
})
