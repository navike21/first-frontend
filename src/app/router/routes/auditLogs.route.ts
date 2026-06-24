import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { AuditLogsPage } from '@domains/audit-log'
import type { Language } from '@/shared/types/languages'

function createAuditLogsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.auditLogs[lang],
    component: AuditLogsPage,
    beforeLoad: requirePermission(...CAN.auditLogsView),
  })
}

const uniqueSlugs = Array.from(new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.auditLogs[l])))

export const allAuditLogsRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => ROUTE_SLUGS.auditLogs[l] === slug)!
  return createAuditLogsRouteTree(lang)
})
