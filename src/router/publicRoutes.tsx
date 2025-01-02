import {
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { publicRoute } from './routers'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { URL_HOME_PAGE } from '@Constants/privatePagesURL'

export const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: 'login',
  component: lazyRouteComponent(
    () => import('@Pages/public/Login/Login'),
    'Login'
  ),
  beforeLoad: () => {
    const { isAuth } = useAuthInformationStore.getState()
    if (isAuth) {
      throw redirect({
        to: URL_HOME_PAGE,
      })
    }
  },
})
