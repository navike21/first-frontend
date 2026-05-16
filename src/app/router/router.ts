import { useEffect } from 'react'
import { createRouter, useNavigate } from '@tanstack/react-router'
import { NAV } from '@/shared/router'
import { rootRoute } from './root'
import { publicLayout, privateLayout } from './layouts'
import { loginRouteTree } from './routes/login.route'
import { dashboardRoute } from './routes/dashboard.route'
import { usersRoute } from './routes/users.route'
import { forbiddenRoute } from './routes/forbidden.route'
import { notFoundRoute } from './routes/not-found.route'
import { getLastValidPath, setLastValidPath } from './navigationHistory'

const NotFoundRedirect = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({
      to: NAV.notFound.path as never,
      replace: true,
      state: {
        brokenPath: globalThis.location.pathname,
        previousPath: getLastValidPath(),
      },
    }).catch(() => null)
  }, [navigate])
  return null
}

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
  publicLayout.addChildren([loginRouteTree]),
  privateLayout.addChildren([dashboardRoute, usersRoute]),
  forbiddenRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundRedirect,
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
