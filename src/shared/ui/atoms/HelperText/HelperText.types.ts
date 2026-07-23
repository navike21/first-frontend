import type { HTMLAttributes, ReactNode } from 'react'

export type HelperTextVariant =
  'default' | 'error' | 'success' | 'warning' | 'info'

export interface HelperTextProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  idField?: string
  size?: 'small' | 'medium' | 'large'
  showIcon?: boolean
  variant?: HelperTextVariant
}
