import type { ReactNode } from 'react'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto'

export type ResolvedTooltipPosition = Exclude<TooltipPosition, 'auto'>

export type TooltipVariant = 'dark' | 'light'

export type TooltipSize = 'small' | 'medium' | 'large'

export interface TooltipProps {
  content: ReactNode
  position?: TooltipPosition
  variant?: TooltipVariant
  size?: TooltipSize
  children: ReactNode
  className?: string
}
