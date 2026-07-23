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

const CollaboratorsPage = lazyRouteComponent(
  () => import('@domains/collaborators/pages/CollaboratorsPage'),
  'CollaboratorsPage'
)
const CreateCollaboratorPage = lazyRouteComponent(
  () => import('@domains/collaborators/pages/CreateCollaboratorPage'),
  'CreateCollaboratorPage'
)
const EditCollaboratorPage = lazyRouteComponent(
  () => import('@domains/collaborators/pages/EditCollaboratorPage'),
  'EditCollaboratorPage'
)
const CollaboratorsTrashPage = lazyRouteComponent(
  () => import('@domains/collaborators/pages/CollaboratorsTrashPage'),
  'CollaboratorsTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.collaborators[l]))
)

export const allCollaboratorsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.collaborators[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.collaboratorsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: CollaboratorsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.collaboratorCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateCollaboratorPage,
          beforeLoad: requirePermission(...CAN.collaboratorsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.collaboratorEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$collaboratorId`,
          component: EditCollaboratorPage,
          beforeLoad: requirePermission(...CAN.collaboratorsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.collaboratorTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: CollaboratorsTrashPage,
          beforeLoad: requirePermission(...CAN.collaboratorsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
