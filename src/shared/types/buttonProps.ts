import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { type IconName } from './icons'
import type { LinkProps } from '@tanstack/react-router'

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
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonBaseProps {
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
