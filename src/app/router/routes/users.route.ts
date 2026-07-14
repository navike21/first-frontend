import { createRoute, lazyRouteComponent, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const UsersPage = lazyRouteComponent(() => import('@domains/users/pages/UsersPage'), 'UsersPage')
const CreateUserPage = lazyRouteComponent(() => import('@domains/users/pages/CreateUserPage'), 'CreateUserPage')
const EditUserPage = lazyRouteComponent(() => import('@domains/users/pages/EditUserPage'), 'EditUserPage')
const UsersTrashPage = lazyRouteComponent(() => import('@domains/users/pages/UsersTrashPage'), 'UsersTrashPage')

function createUsersRouteTree(lang: Language) {
  // Viewing the Users section requires read (or manage / *:*); deeper routes
  // add the specific capability. Blocks direct-URL access, not just the menu.
  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.users[lang],
    component: Outlet,
    beforeLoad: requirePermission(...CAN.usersView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: UsersPage,
  })

  const create = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userCreate[lang],
    component: CreateUserPage,
    beforeLoad: requirePermission(...CAN.usersCreate),
  })

  const edit = createRoute({
    getParentRoute: () => layout,
    path: `${ROUTE_SLUGS.userEdit[lang]}/$userId`,
    component: EditUserPage,
    beforeLoad: requirePermission(...CAN.usersUpdate),
  })

  const trash = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userTrash[lang],
    component: UsersTrashPage,
    beforeLoad: requirePermission(...CAN.usersTrash),
  })

  return layout.addChildren([index, create, edit, trash])
}

export const allUsersRouteTrees = SUPPORTED_LANGUAGES.map(createUsersRouteTree)
