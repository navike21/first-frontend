import type { IconName } from '@/shared/types/icons'

export interface BreadcrumbItem {
  href?: string
  icon?: IconName
  label: string
}

export interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[]
}
