import { createRoute, createRouter, redirect } from '@tanstack/react-router'
import { NotFoundPage } from '@domains/errors'
import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { rootRoute } from './root'
import { langRoute, langCatchAll } from './routes/lang.route'
import { publicLayout, privateLayout } from './layouts'
import { loginRouteTree } from './routes/login.route'
import { dashboardRoute } from './routes/dashboard.route'
import { allUsersRouteTrees } from './routes/users.route'
import { allUserGroupsRouteTrees } from './routes/userGroups.route'
import { allClientsRouteTrees } from './routes/clients.route'
import { allServicesRouteTrees } from './routes/services.route'
import { allPortfolioRouteTrees } from './routes/portfolio.route'
import { allPagesRouteTrees } from './routes/pages.route'
import { allCollaboratorsRouteTrees } from './routes/collaborators.route'
import { allSubscribersRouteTrees } from './routes/subscribers.route'
import { allAuditLogsRouteTrees } from './routes/auditLogs.route'
import { allAppSettingsRouteTrees } from './routes/appSettings.route'
import { allProfileRouteTrees } from './routes/profile.route'
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
    privateLayout.addChildren([
      dashboardRoute,
      ...allUsersRouteTrees,
      ...allUserGroupsRouteTrees,
      ...allClientsRouteTrees,
      ...allServicesRouteTrees,
      ...allPortfolioRouteTrees,
      ...allPagesRouteTrees,
      ...allCollaboratorsRouteTrees,
      ...allSubscribersRouteTrees,
      ...allAuditLogsRouteTrees,
      ...allAppSettingsRouteTrees,
      ...allProfileRouteTrees,
    ]),
    ...allForbiddenRouteTrees,
    ...allNotFoundRouteTrees,
    langCatchAll,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
})

const forbiddenSlugs = new Set<string>(Object.values(ROUTE_SLUGS.forbidden))
const notFoundSlugs = new Set<string>(Object.values(ROUTE_SLUGS.notFound))

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
