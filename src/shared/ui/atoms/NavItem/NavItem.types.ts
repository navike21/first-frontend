import type { IconName } from '@/shared/types/icons'

export interface NavItemProps {
  icon: IconName
  label: string
  /** If provided, renders as a router Link; otherwise renders as a button */
  to?: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}
