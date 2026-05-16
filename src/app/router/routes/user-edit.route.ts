import { createRoute } from '@tanstack/react-router'
import { usersLayoutRoute } from './users.route'
import { EditUserPage } from '@/pages/Users/ui/EditUserPage'

export const userEditRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: '$userId/editar',
  component: EditUserPage,
})
