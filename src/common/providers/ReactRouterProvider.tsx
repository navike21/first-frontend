import { Typography } from '@mui/material'
import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const rootRoute = createRootRoute({
  component: lazyRouteComponent(
    () => import('@Layouts/MainLayout/MainLayout'),
    'MainLayout'
  ),
})
const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: lazyRouteComponent(
    () => import('@Layouts/PublicLayout/PublicLayout'),
    'PublicLayout'
  ),
})
const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'private',
  component: lazyRouteComponent(
    () => import('@Layouts/PrivateLayout/PrivateLayout'),
    'PrivateLayout'
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: 'login',
  component: function Login() {
    return (
      <div className="p-2">
        <Typography variant="h3">Login</Typography>
      </div>
    )
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: 'dashboard',
  component: function Dashboard() {
    return (
      <div className="p-2">
        <Typography variant="h1">Dashboard</Typography>
        <Outlet />
      </div>
    )
  },
})

const dashboardRouteSub = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'sub',
  component: function Dashboard() {
    return (
      <div className="p-2">
        <Typography variant="h1">Dashboard sub</Typography>
      </div>
    )
  },
})

const dashboardTree = dashboardRoute.addChildren([dashboardRouteSub])

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <Typography variant="h1">Bienvenido a la Página Principal</Typography>
      </div>
    )
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  publicRoute.addChildren([loginRoute]),
  privateRoute.addChildren([dashboardTree]),
])

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Página no encontrada</p>
      </div>
    )
  },
})

declare module '@tanstack/react-router' {
  interface IRegister {
    router: typeof router
  }
}

export const ReactRouterProvider = () => (
  <>
    <RouterProvider router={router} />
    <TanStackRouterDevtools initialIsOpen={false} router={router} />
  </>
)
