import type { IconName } from '@/shared/types/icons'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ChipProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'informative' | 'error'
  size?: 'x-small' | 'small' | 'medium' | 'large'
  icon?: IconName
  iconContent?: ReactNode
  deleteable?: boolean
  deleteButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'className'
  >
}
