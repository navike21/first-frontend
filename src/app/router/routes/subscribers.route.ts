import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { SubscribersPage } from '@domains/subscribers/pages/SubscribersPage'
import { CreateSubscriberPage } from '@domains/subscribers/pages/CreateSubscriberPage'
import { EditSubscriberPage } from '@domains/subscribers/pages/EditSubscriberPage'
import { SubscribersTrashPage } from '@domains/subscribers/pages/SubscribersTrashPage'
import type { Language } from '@/shared/types/languages'

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.subscribers[l]))
)

export const allSubscribersRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.subscribers[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.subscribersView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: SubscribersPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.subscriberCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateSubscriberPage,
          beforeLoad: requirePermission(...CAN.subscribersCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.subscriberEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `$subscriberId/${editSlug}`,
          component: EditSubscriberPage,
          beforeLoad: requirePermission(...CAN.subscribersUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.subscriberTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: SubscribersTrashPage,
          beforeLoad: requirePermission(...CAN.subscribersTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
