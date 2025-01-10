import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { loginRoute } from './publicRoutes'
import { dashboardRoute } from './privateRoutes'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { URL_LOGIN } from '@Constants/publicPagesURL'

const rootRoute = createRootRoute({
  component: lazyRouteComponent(
    () => import('@Layouts/MainLayout/MainLayout'),
    'MainLayout'
  ),
})
export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: lazyRouteComponent(
    () => import('@Layouts/PublicLayout/PublicLayout'),
    'PublicLayout'
  ),
})
export const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'private',
  component: lazyRouteComponent(
    () => import('@Layouts/PrivateLayout/PrivateLayout'),
    'PrivateLayout'
  ),
  beforeLoad: () => {
    const { isAuth } = useAuthInformationStore.getState()
    if (!isAuth) {
      throw redirect({
        to: URL_LOGIN,
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([loginRoute]),
  privateRoute.addChildren([dashboardRoute]),
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Página no encontrada</p>
      </div>
    )
  },
})
