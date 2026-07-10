import { createRoute, Outlet, type AnyRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { TagsPage } from '@domains/tags/pages/TagsPage'
import { CreateTagPage } from '@domains/tags/pages/CreateTagPage'
import { EditTagPage } from '@domains/tags/pages/EditTagPage'
import { TagsTrashPage } from '@domains/tags/pages/TagsTrashPage'
import type { Language } from '@/shared/types/languages'

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
