import { createRoute, createRouter, redirect } from '@tanstack/react-router'
import { NotFoundPage, ServerErrorPage } from '@domains/errors'
import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { rootRoute } from './root'
import { langRoute, langCatchAll } from './routes/lang.route'
import { publicLayout, privateLayout } from './layouts'
import { allLoginRouteTrees } from './routes/login.route'
import { allForgotPasswordRouteTrees } from './routes/forgotPassword.route'
import { resetPasswordRouteTree } from './routes/resetPassword.route'
import { dashboardRoute } from './routes/dashboard.route'
import { allUsersRouteTrees } from './routes/users.route'
import { allUserGroupsRouteTrees } from './routes/userGroups.route'
import { allClientsRouteTrees } from './routes/clients.route'
import { allServicesRouteTrees } from './routes/services.route'
import { allPortfolioRouteTrees } from './routes/portfolio.route'
import { allMediaRouteTrees } from './routes/media.route'
import { allPagesRouteTrees } from './routes/pages.route'
import { allCollaboratorsRouteTrees } from './routes/collaborators.route'
import { allCategoriesRouteTrees } from './routes/categories.route'
import { allTagsRouteTrees } from './routes/tags.route'
import { allSubscribersRouteTrees } from './routes/subscribers.route'
import { allFormsRouteTrees } from './routes/forms.route'
import { allAuditLogsRouteTrees } from './routes/auditLogs.route'
import { allAppSettingsRouteTrees } from './routes/appSettings.route'
import { allSiteConfigRouteTrees } from './routes/siteConfig.route'
import { allProfileRouteTrees } from './routes/profile.route'
import { allForbiddenRouteTrees } from './routes/forbidden.route'
import { allNotFoundRouteTrees } from './routes/not-found.route'
import { allServerErrorRouteTrees } from './routes/serverError.route'
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
    publicLayout.addChildren([
      ...allLoginRouteTrees,
      ...allForgotPasswordRouteTrees,
      resetPasswordRouteTree,
    ]),
    privateLayout.addChildren([
      dashboardRoute,
      ...allUsersRouteTrees,
      ...allUserGroupsRouteTrees,
      ...allClientsRouteTrees,
      ...allServicesRouteTrees,
      ...allPortfolioRouteTrees,
      ...allMediaRouteTrees,
      ...allPagesRouteTrees,
      ...allCollaboratorsRouteTrees,
      ...allCategoriesRouteTrees,
      ...allTagsRouteTrees,
      ...allSubscribersRouteTrees,
      ...allFormsRouteTrees,
      ...allAuditLogsRouteTrees,
      ...allAppSettingsRouteTrees,
      ...allSiteConfigRouteTrees,
      ...allProfileRouteTrees,
    ]),
    ...allForbiddenRouteTrees,
    ...allNotFoundRouteTrees,
    ...allServerErrorRouteTrees,
    langCatchAll,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ServerErrorPage,
})

const forbiddenSlugs = new Set<string>(Object.values(ROUTE_SLUGS.forbidden))
const notFoundSlugs = new Set<string>(Object.values(ROUTE_SLUGS.notFound))
const serverErrorSlugs = new Set<string>(Object.values(ROUTE_SLUGS.serverError))

router.subscribe('onResolved', () => {
  const { location, matches } = router.state
  const isNotFoundOrError = matches.some(
    (m) => m.status === 'notFound' || m.status === 'error'
  )
  const lastSegment = location.pathname.split('/').filter(Boolean).at(-1) ?? ''
  if (
    !isNotFoundOrError &&
    !forbiddenSlugs.has(lastSegment) &&
    !notFoundSlugs.has(lastSegment) &&
    !serverErrorSlugs.has(lastSegment)
  ) {
    setLastValidPath(location.pathname)
  }
})
