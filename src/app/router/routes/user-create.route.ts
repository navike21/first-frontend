import { createRoute } from '@tanstack/react-router'
import { usersLayoutRoute } from './users.route'
import { CreateUserPage } from '@/pages/Users/ui/CreateUserPage'

export const userCreateRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: 'nuevo',
  component: CreateUserPage,
})
