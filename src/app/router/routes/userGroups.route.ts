import { createRoute, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { UserGroupsPage } from '@domains/user-groups/pages/UserGroupsPage'
import { CreateUserGroupPage } from '@domains/user-groups/pages/CreateUserGroupPage'
import { EditUserGroupPage } from '@domains/user-groups/pages/EditUserGroupPage'
import { GroupUsersPage } from '@domains/user-groups/pages/GroupUsersPage'
import { UserGroupsTrashPage } from '@domains/user-groups/pages/UserGroupsTrashPage'
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

  const users = createRoute({
    getParentRoute: () => layout,
    path: `$groupId/${ROUTE_SLUGS.userGroupUsers[lang]}`,
    component: GroupUsersPage,
  })

  const trash = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userGroupTrash[lang],
    component: UserGroupsTrashPage,
  })

  return layout.addChildren([index, create, edit, users, trash])
}

export const allUserGroupsRouteTrees = SUPPORTED_LANGUAGES.map(
  createUserGroupsRouteTree
)
