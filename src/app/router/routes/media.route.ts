import {
  createRoute,
  lazyRouteComponent,
  Outlet,
  type AnyRoute,
} from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const MediaPage = lazyRouteComponent(
  () => import('@domains/media/pages/MediaPage'),
  'MediaPage'
)
const MediaTrashPage = lazyRouteComponent(
  () => import('@domains/media/pages/MediaTrashPage'),
  'MediaTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.media[l]))
)

export const allMediaRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.media[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.mediaView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: MediaPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const trashSlug = ROUTE_SLUGS.mediaTrash[lang]
    if (!seen.has(trashSlug)) {
      seen.add(trashSlug)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: MediaTrashPage,
          beforeLoad: requirePermission(...CAN.mediaTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
