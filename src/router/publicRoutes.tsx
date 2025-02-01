import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { publicRoute } from './routers'
import { handleValidateAuth } from '@Utils/handleValidateAuth'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { urlLoginPath } from '@Pages/public/login/languages/urlLoginPath'

const { language } = useOptionsBrowserStore.getState()

export const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: urlLoginPath[language],
  component: lazyRouteComponent(
    () => import('@Pages/public/login/Login'),
    'Login'
  ),
  beforeLoad: handleValidateAuth,
})
