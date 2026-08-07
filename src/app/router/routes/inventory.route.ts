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

const LocationsPage = lazyRouteComponent(
  () => import('@domains/inventory/pages/LocationsPage'),
  'LocationsPage'
)
const CreateLocationPage = lazyRouteComponent(
  () => import('@domains/inventory/pages/CreateLocationPage'),
  'CreateLocationPage'
)
const EditLocationPage = lazyRouteComponent(
  () => import('@domains/inventory/pages/EditLocationPage'),
  'EditLocationPage'
)
const LocationsTrashPage = lazyRouteComponent(
  () => import('@domains/inventory/pages/LocationsTrashPage'),
  'LocationsTrashPage'
)
const InventoryStockPage = lazyRouteComponent(
  () => import('@domains/inventory/pages/InventoryStockPage'),
  'InventoryStockPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.locations[l]))
)

const allLocationsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.locations[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.inventoryView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: LocationsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.locationCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateLocationPage,
          beforeLoad: requirePermission(...CAN.inventoryCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.locationEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$locationId`,
          component: EditLocationPage,
          beforeLoad: requirePermission(...CAN.inventoryUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.locationTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: LocationsTrashPage,
          beforeLoad: requirePermission(...CAN.inventoryTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})

const stockSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.inventoryStock[l]))
)

const allInventoryStockRouteTrees = stockSlugs.map((slug) =>
  createRoute({
    getParentRoute: () => privateLayout,
    path: slug,
    component: InventoryStockPage,
    beforeLoad: requirePermission(...CAN.inventoryView),
  })
)

export const allInventoryRouteTrees = [
  ...allLocationsRouteTrees,
  ...allInventoryStockRouteTrees,
]
