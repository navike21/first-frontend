import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { CollaboratorsPage } from '@domains/collaborators'
import type { Language } from '@/shared/types/languages'

function createCollaboratorsRouteTree(lang: Language) {
  return createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.collaborators[lang],
    component: CollaboratorsPage,
    beforeLoad: requirePermission(...CAN.collaboratorsView),
  })
}

const uniqueSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.collaborators[l]))
)

export const allCollaboratorsRouteTrees = uniqueSlugs.map((slug) => {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => ROUTE_SLUGS.collaborators[l] === slug
  )!
  return createCollaboratorsRouteTree(lang)
})
