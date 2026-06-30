import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { ClientsPage } from '@domains/clients/pages/ClientsPage'
import { CreateClientPage } from '@domains/clients/pages/CreateClientPage'
import { EditClientPage } from '@domains/clients/pages/EditClientPage'
import { ClientsTrashPage } from '@domains/clients/pages/ClientsTrashPage'

// The `clients` slug is shared by some languages (en/fr → "clients", es/pt →
// "clientes"), so the layout is deduped by its parent slug. Under each unique
// parent, child routes (create/edit/trash) are registered for every language
// that maps to it, deduped by child slug — keeping all localized URLs valid.
const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.clients[l]))
)

export const allClientsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l) => ROUTE_SLUGS.clients[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.clientsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ClientsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()
  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.clientCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateClientPage,
          beforeLoad: requirePermission(...CAN.clientsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.clientEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `$clientId/${editSlug}`,
          component: EditClientPage,
          beforeLoad: requirePermission(...CAN.clientsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.clientTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ClientsTrashPage,
          beforeLoad: requirePermission(...CAN.clientsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
