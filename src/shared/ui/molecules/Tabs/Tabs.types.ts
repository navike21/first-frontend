import type { ReactNode } from 'react'
import type { IconName } from '@/shared/types/icons'

export interface TabItem {
  id: string
  label: ReactNode
  icon?: IconName
}

export interface TabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
  /** Accessible label for the tablist. */
  ariaLabel?: string
  /** Unique prefix for Framer Motion layoutId — avoids animation conflicts when multiple Tabs are mounted simultaneously. */
  instanceId?: string
}
