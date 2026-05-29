import { createRoute, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { UserGroupsPage } from '@/pages/UserGroups/ui/UserGroupsPage'
import { CreateUserGroupPage } from '@/pages/UserGroups/ui/CreateUserGroupPage'
import { EditUserGroupPage } from '@/pages/UserGroups/ui/EditUserGroupPage'
import type { Language } from '@/shared/types/languages'

function createUserGroupsRouteTree(lang: Language) {
  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.userGroups[lang],
    component: Outlet,
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: UserGroupsPage,
  })

  const create = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userGroupCreate[lang],
    component: CreateUserGroupPage,
  })

  const edit = createRoute({
    getParentRoute: () => layout,
    path: `$groupId/${ROUTE_SLUGS.userGroupEdit[lang]}`,
    component: EditUserGroupPage,
  })

  return layout.addChildren([index, create, edit])
}

export const allUserGroupsRouteTrees = SUPPORTED_LANGUAGES.map(createUserGroupsRouteTree)
