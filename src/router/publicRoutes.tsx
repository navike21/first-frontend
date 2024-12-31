import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { publicRoute } from './routers'

export const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: 'login',
  component: lazyRouteComponent(
    () => import('@Pages/public/Login/Login'),
    'Login'
  ),
})
