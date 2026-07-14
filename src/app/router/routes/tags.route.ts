import { createRoute, lazyRouteComponent, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const TagsPage = lazyRouteComponent(() => import('@domains/tags/pages/TagsPage'), 'TagsPage')
const CreateTagPage = lazyRouteComponent(() => import('@domains/tags/pages/CreateTagPage'), 'CreateTagPage')
const EditTagPage = lazyRouteComponent(() => import('@domains/tags/pages/EditTagPage'), 'EditTagPage')
const TagsTrashPage = lazyRouteComponent(() => import('@domains/tags/pages/TagsTrashPage'), 'TagsTrashPage')

const parentSlugs = Array.from(new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.tags[l])))

export const allTagsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter((l: Language) => ROUTE_SLUGS.tags[l] === parentSlug)

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.tagsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: TagsPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.tagCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateTagPage,
          beforeLoad: requirePermission(...CAN.tagsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.tagEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$tagId`,
          component: EditTagPage,
          beforeLoad: requirePermission(...CAN.tagsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.tagTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: TagsTrashPage,
          beforeLoad: requirePermission(...CAN.tagsTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
