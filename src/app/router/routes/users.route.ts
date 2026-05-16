import { createRoute, Outlet } from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { UsersPage } from '@/pages/Users/ui/UsersPage'

export const usersLayoutRoute = createRoute({
  getParentRoute: () => privateLayout,
  path: 'usuarios',
  component: Outlet,
})

export const usersIndexRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: '/',
  component: UsersPage,
})
