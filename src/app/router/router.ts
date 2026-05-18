import { createRoute, createRouter, redirect } from '@tanstack/react-router'
import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { rootRoute } from './root'
import { langRoute, langCatchAll } from './routes/lang.route'
import { publicLayout, privateLayout } from './layouts'
import { loginRouteTree } from './routes/login.route'
import { dashboardRoute } from './routes/dashboard.route'
import { allUsersRouteTrees } from './routes/users.route'
import { allForbiddenRouteTrees } from './routes/forbidden.route'
import { allNotFoundRouteTrees } from './routes/not-found.route'
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
    ...allForbiddenRouteTrees,
    ...allNotFoundRouteTrees,
    langCatchAll,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => null,
})

const forbiddenSlugs = new Set(Object.values(ROUTE_SLUGS.forbidden))
const notFoundSlugs = new Set(Object.values(ROUTE_SLUGS.notFound))

router.subscribe('onResolved', () => {
  const { location, matches } = router.state
  const isNotFound = matches.some((m) => m.status === 'notFound')
  const lastSegment = location.pathname.split('/').filter(Boolean).at(-1) ?? ''
  if (
    !isNotFound &&
    !forbiddenSlugs.has(lastSegment) &&
    !notFoundSlugs.has(lastSegment)
  ) {
    setLastValidPath(location.pathname)
  }
})
