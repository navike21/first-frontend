import type { ReactNode } from 'react'
import type { IconName } from '@/shared/types/icons'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto'

export type ResolvedTooltipPosition = Exclude<TooltipPosition, 'auto'>

export type TooltipVariant = 'dark' | 'light'

export type TooltipSize = 'small' | 'medium' | 'large'

export interface TooltipProps {
  /** Free-form content — use when you need full control over the tooltip body */
  content?: ReactNode
  /** Structured: main label shown in the tooltip */
  heading?: string
  /** Structured: icon displayed to the left of the heading */
  icon?: IconName
  /** Structured: secondary descriptive text below the heading */
  subtitle?: string
  position?: TooltipPosition
  variant?: TooltipVariant
  size?: TooltipSize
  children: ReactNode
  className?: string
}
