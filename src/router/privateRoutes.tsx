import { Title } from '@Components/Title/Title'
import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { privateRoute } from './routers'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { urlProfilePath } from '@Pages/private/profile/languages/urlProfilePath'

const { language } = useOptionsBrowserStore.getState()

export const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/',
  component: function Dashboard() {
    return (
      <div className="p-2">
        <Title>Dashboard</Title>
      </div>
    )
  },
})

export const profileRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: urlProfilePath[language],
  component: lazyRouteComponent(
    () => import('@Pages/private/profile/Profile'),
    'Profile'
  ),
})
