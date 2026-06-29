import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { type IconName } from './icons'
import type { LinkProps } from '@tanstack/react-router'

/**
 * Event handlers that framer-motion redefines on its `motion.*` components.
 * Omit them when spreading native button attributes onto a motion element,
 * otherwise React's DOM handler types clash with framer's pan/animation types.
 */
export type MotionConflictingHandlers =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'

export interface ButtonBaseProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'text'
    | 'warning'
    | 'error'
    | 'information'
  size?: 'small' | 'medium' | 'large'
  icon?: IconName
  loading?: boolean
  fullWidth?: boolean
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictingHandlers>,
    ButtonBaseProps {
  children: ReactNode
}

export interface LinkButtonProps
  extends
    ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  href?: string
  children: ReactNode
  className?: string
}
