import { homeLanguage } from '@Pages/private/home/languages/homeLanguage'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { searchModulePath } from '@Utils/searchModulePath'
import { RxDotFilled } from 'react-icons/rx'
import { BreadcrumbsMUI, LastBreadcrumb, LinkBreadcrumb } from './style'

export const Breadcrumb = () => {
  const { matches } = useRouterState()
  const router = useRouter()
  const { language } = useOptionsBrowserStore()

  const breadcrumbs = matches.slice(1).map((match, index) => {
    const route = router.routesById[match.routeId]
    const routeName = route?.path || homeLanguage[language]
    const isLast = index === matches.length - 2

    return isLast ? (
      <LastBreadcrumb key={match.routeId} color="text.primary">
        {`${searchModulePath(routeName)?.title}`}
      </LastBreadcrumb>
    ) : (
      <LinkBreadcrumb
        key={match.routeId}
        to={match.pathname}
        style={{ textDecoration: 'none' }}
      >
        {match.pathname === '/'
          ? routeName
          : searchModulePath(match.pathname)?.title}
      </LinkBreadcrumb>
    )
  })

  return (
    <BreadcrumbsMUI separator={<RxDotFilled />}>{breadcrumbs}</BreadcrumbsMUI>
  )
}
