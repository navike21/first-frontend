import type { IconName } from '@/shared/types/icons'
import { NAV } from '@/shared/router'

export interface MenuItem {
  id: string
  label: string
  icon: IconName
  href?: string
  children?: {
    id: string
    label: string
    href: string
  }[]
}

// Add menu items here as each module is built and its route is registered.
export const menuConfig: MenuItem[] = [
  {
    id: 'dashboard',
    label: NAV.home.label,
    icon: 'RiDashboard2Line',
    href: NAV.home.path,
  },
  {
    id: 'users',
    label: NAV.users.label,
    icon: 'RiGroupLine',
    href: NAV.users.path,
  },
]
