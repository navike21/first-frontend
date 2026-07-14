import { createRoute, lazyRouteComponent, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const ServicesPage = lazyRouteComponent(() => import('@domains/services/pages/ServicesPage'), 'ServicesPage')
const CreateServicePage = lazyRouteComponent(() => import('@domains/services/pages/CreateServicePage'), 'CreateServicePage')
const EditServicePage = lazyRouteComponent(() => import('@domains/services/pages/EditServicePage'), 'EditServicePage')
const ServicesTrashPage = lazyRouteComponent(() => import('@domains/services/pages/ServicesTrashPage'), 'ServicesTrashPage')

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.services[l]))
)

export const allServicesRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.services[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.servicesView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ServicesPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.serviceCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateServicePage,
          beforeLoad: requirePermission(...CAN.servicesCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.serviceEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$serviceId`,
          component: EditServicePage,
          beforeLoad: requirePermission(...CAN.servicesUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.serviceTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ServicesTrashPage,
          beforeLoad: requirePermission(...CAN.servicesTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
