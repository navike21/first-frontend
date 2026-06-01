import { createRoute, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { UsersPage } from '@/pages/Users/ui/UsersPage'
import { CreateUserPage } from '@/pages/Users/ui/CreateUserPage'
import { EditUserPage } from '@/pages/Users/ui/EditUserPage'
import { UsersTrashPage } from '@/pages/Users/ui/UsersTrashPage'
import type { Language } from '@/shared/types/languages'

function createUsersRouteTree(lang: Language) {
  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: ROUTE_SLUGS.users[lang],
    component: Outlet,
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
  })

  const edit = createRoute({
    getParentRoute: () => layout,
    path: `$userId/${ROUTE_SLUGS.userEdit[lang]}`,
    component: EditUserPage,
  })

  const trash = createRoute({
    getParentRoute: () => layout,
    path: ROUTE_SLUGS.userTrash[lang],
    component: UsersTrashPage,
  })

  return layout.addChildren([index, create, edit, trash])
}

export const allUsersRouteTrees = SUPPORTED_LANGUAGES.map(createUsersRouteTree)
