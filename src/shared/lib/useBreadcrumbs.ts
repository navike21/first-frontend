import { useRouterState } from '@tanstack/react-router'
import type { BreadcrumbItem } from '@/shared/ui'
import { SEGMENT_LABELS } from '@/shared/router/breadcrumbs.config'

const HOME_ITEM: BreadcrumbItem = {
  href: '/',
  icon: 'RiHomeLine',
  label: 'Inicio',
}

const isIdSegment = (segment: string): boolean =>
  /^[0-9a-f]{24}$/i.test(segment) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

const buildPathItems = (segments: readonly string[]): readonly BreadcrumbItem[] => {
  const visible = segments
    .map((segment, index) => ({ segment, index }))
    .filter(({ segment }) => !isIdSegment(segment))

  return visible.map(({ segment, index }, visibleIndex) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = SEGMENT_LABELS[segment] ?? segment
    const isLast = visibleIndex === visible.length - 1
    return isLast ? { label } : { href, label }
  })
}

export const useBreadcrumbs = (): readonly BreadcrumbItem[] => {
  const { location } = useRouterState()
  const { pathname } = location

  if (pathname === '/') return [HOME_ITEM]

  const segments = pathname.split('/').filter(Boolean)
  return [HOME_ITEM, ...buildPathItems(segments)]
}
