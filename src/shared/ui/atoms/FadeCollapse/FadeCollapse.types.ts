import type { ReactNode } from 'react'

export interface FadeCollapseProps {
  show: boolean
  children: ReactNode
  className?: string
  animateHeight?: boolean
  direction?: 'up' | 'down' | 'none'
}
