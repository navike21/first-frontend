import { useRouterState } from '@tanstack/react-router'
import { useLanguageStore } from '@/shared/model'
import type { BreadcrumbItem } from '@/shared/ui'
import { getSegmentLabel, getHomeLabel } from '@/shared/router/breadcrumbs.config'
import { navPaths } from '@/shared/router/nav-paths'

const isIdSegment = (segment: string): boolean =>
  /^[0-9a-f]{24}$/i.test(segment) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

export const useBreadcrumbs = (): readonly BreadcrumbItem[] => {
  const { location } = useRouterState()
  const { pathname } = location
  const lang = useLanguageStore((s) => s.language)

  const homeItem: BreadcrumbItem = {
    href: navPaths.home(lang),
    icon: 'RiHomeLine',
    label: getHomeLabel(lang),
  }

  const segments = pathname.split('/').filter(Boolean)

  // With lang prefix: segments[0] is the lang code — skip it for breadcrumbs
  const moduleSegments = segments.length > 1 ? segments.slice(1) : []

  if (moduleSegments.length === 0) return [homeItem]

  const visible = moduleSegments
    .map((segment, index) => ({ segment, index }))
    .filter(({ segment }) => !isIdSegment(segment))

  const pathItems: BreadcrumbItem[] = visible.map(({ segment, index }, visibleIndex) => {
    // href includes lang prefix + all segments up to this one
    const href = `/${lang}/` + moduleSegments.slice(0, index + 1).join('/')
    const label = getSegmentLabel(segment, lang)
    const isLast = visibleIndex === visible.length - 1
    return isLast ? { label } : { href, label }
  })

  return [homeItem, ...pathItems]
}
