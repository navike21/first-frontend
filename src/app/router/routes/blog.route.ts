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

const BlogPage = lazyRouteComponent(
  () => import('@domains/blog/pages/BlogPage'),
  'BlogPage'
)
const CreateBlogPostPage = lazyRouteComponent(
  () => import('@domains/blog/pages/CreateBlogPostPage'),
  'CreateBlogPostPage'
)
const EditBlogPostPage = lazyRouteComponent(
  () => import('@domains/blog/pages/EditBlogPostPage'),
  'EditBlogPostPage'
)
const BlogTrashPage = lazyRouteComponent(
  () => import('@domains/blog/pages/BlogTrashPage'),
  'BlogTrashPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.blog[l]))
)

export const allBlogRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.blog[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    beforeLoad: requirePermission(...CAN.blogView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: BlogPage,
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.blogCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateBlogPostPage,
          beforeLoad: requirePermission(...CAN.blogCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.blogEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$postId`,
          component: EditBlogPostPage,
          beforeLoad: requirePermission(...CAN.blogUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.blogTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: BlogTrashPage,
          beforeLoad: requirePermission(...CAN.blogTrash),
        })
      )
    }
  }

  return layout.addChildren(children)
})
