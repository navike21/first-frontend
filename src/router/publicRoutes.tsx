import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { publicRoute } from './routers'
import { handleValidateAuth } from '@Utils/handleValidateAuth'

export const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: 'login',
  component: lazyRouteComponent(
    () => import('@Pages/public/Login/Login'),
    'Login'
  ),
  beforeLoad: handleValidateAuth,
})
