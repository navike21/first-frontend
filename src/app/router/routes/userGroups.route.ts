import { createRoute, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import { UserGroupsPage } from '@domains/user-groups/pages/UserGroupsPage'
import { CreateUserGroupPage } from '@domains/user-groups/pages/CreateUserGroupPage'
import { EditUserGroupPage } from '@domains/user-groups/pages/EditUserGroupPage'
import { GroupUsersPage } from '@domains/user-groups/pages/GroupUsersPage'
import { UserGroupsTrashPage } from '@domains/user-groups/pages/UserGroupsTrashPage'
import type { Language } from '@/shared/types/languages'

function createUserGroupsRouteTree(lang: Language) {
  // Viewing the User Groups section requires read (or manage / *:*); deeper
  // routes add the specific capability. Blocks direct-URL access too.
  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.userGroups[lang],
    component: Outlet,
    beforeLoad: requirePermission(...CAN.groupsView),
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
    beforeLoad: requirePermission(...CAN.groupsCreate),
  })

  const edit = createRoute({
    getParentRoute: () => layout,
    path: `${ROUTE_SLUGS.userGroupEdit[lang]}/$groupId`,
    component: EditUserGroupPage,
    beforeLoad: requirePermission(...CAN.groupsUpdate),
  })

  // Managing a group's members is a group update.
  const users = createRoute({
    getParentRoute: () => layout,
    path: `${ROUTE_SLUGS.userGroupUsers[lang]}/$groupId`,
    component: GroupUsersPage,
    beforeLoad: requirePermission(...CAN.groupsUpdate),
  })

  const trash = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userGroupTrash[lang],
    component: UserGroupsTrashPage,
    beforeLoad: requirePermission(...CAN.groupsTrash),
  })

  return layout.addChildren([index, create, edit, users, trash])
}

export const allUserGroupsRouteTrees = SUPPORTED_LANGUAGES.map(
  createUserGroupsRouteTree
)
