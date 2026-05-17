import { createRoute, createRouter, redirect } from '@tanstack/react-router'
import { useLanguageStore } from '@/shared/model/language.store'
import { NAV } from '@/shared/router'
import { rootRoute } from './root'
import { langRoute } from './routes/lang.route'
import { publicLayout, privateLayout } from './layouts'
import { loginRouteTree } from './routes/login.route'
import { dashboardRoute } from './routes/dashboard.route'
import { allUsersRouteTrees } from './routes/users.route'
import { forbiddenRoute } from './routes/forbidden.route'
import { notFoundRoute } from './routes/not-found.route'
import { setLastValidPath } from './navigationHistory'

const rootRedirect = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const lang = useLanguageStore.getState().language
    throw redirect({ to: `/${lang}` as never })
  },
  component: () => null,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface HistoryState {
    brokenPath?: string
    previousPath?: string
  }
}

const routeTree = rootRoute.addChildren([
  rootRedirect,
  langRoute.addChildren([
    publicLayout.addChildren([loginRouteTree]),
    privateLayout.addChildren([dashboardRoute, ...allUsersRouteTrees]),
  ]),
  forbiddenRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => null,
})

router.subscribe('onResolved', () => {
  const { location, matches } = router.state
  const isNotFound = matches.some((m) => m.status === 'notFound')
  if (
    !isNotFound &&
    location.pathname !== NAV.notFound.path &&
    location.pathname !== NAV.forbidden.path
  ) {
    setLastValidPath(location.pathname)
  }
})
