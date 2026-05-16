import { createRoute } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { NAV } from '@/shared/router'
import { UsersPage } from '@/pages/Users/ui/UsersPage'

export const usersRoute = createRoute({
  getParentRoute: () => privateLayout,
  path: NAV.users.segment,
  component: UsersPage,
})
