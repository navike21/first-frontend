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

const ShippingRulesPage = lazyRouteComponent(
  () => import('@domains/shipping/pages/ShippingRulesPage'),
  'ShippingRulesPage'
)
const CreateShippingRulePage = lazyRouteComponent(
  () => import('@domains/shipping/pages/CreateShippingRulePage'),
  'CreateShippingRulePage'
)
const EditShippingRulePage = lazyRouteComponent(
  () => import('@domains/shipping/pages/EditShippingRulePage'),
  'EditShippingRulePage'
)
const ShippingRulesTrashPage = lazyRouteComponent(
  () => import('@domains/shipping/pages/ShippingRulesTrashPage'),
  'ShippingRulesTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.shippingRules[l]))
)

export const allShippingRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.shippingRules[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.shippingView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: ShippingRulesPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.shippingRuleCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateShippingRulePage,
          beforeLoad: requirePermission(...CAN.shippingCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.shippingRuleEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$ruleId`,
          component: EditShippingRulePage,
          beforeLoad: requirePermission(...CAN.shippingUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.shippingRuleTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: ShippingRulesTrashPage,
          beforeLoad: requirePermission(...CAN.shippingTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
