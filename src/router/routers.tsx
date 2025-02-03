import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { loginRoute } from './publicRoutes'
import { dashboardRoute, profileRoute } from './privateRoutes'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { urlLoginPath } from '@Pages/public/login/languages/urlLoginPath'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { EProcessName } from '@Enums/processName'

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
    const { language, setProcessName } = useOptionsBrowserStore.getState()
    if (!isAuth) {
      setProcessName(EProcessName.LOGIN)
      throw redirect({
        to: urlLoginPath[language].slug,
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([loginRoute]),
  privateRoute.addChildren([dashboardRoute, profileRoute]),
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
