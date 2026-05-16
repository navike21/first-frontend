import { useRouterState } from '@tanstack/react-router'
import type { BreadcrumbItem } from '@/shared/ui'
import { SEGMENT_LABELS } from '@/shared/router/breadcrumbs.config'

const HOME_ITEM: BreadcrumbItem = {
  href: '/',
  icon: 'RiHomeLine',
  label: 'Inicio',
}

const buildPathItems = (
  segments: readonly string[]
): readonly BreadcrumbItem[] =>
  segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = SEGMENT_LABELS[segment] ?? segment
    const isLast = index === segments.length - 1
    return isLast ? { label } : { href, label }
  })

export const useBreadcrumbs = (): readonly BreadcrumbItem[] => {
  const { location } = useRouterState()
  const { pathname } = location

  if (pathname === '/') return [HOME_ITEM]

  const segments = pathname.split('/').filter(Boolean)
  return [HOME_ITEM, ...buildPathItems(segments)]
}
