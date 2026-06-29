import type { ButtonHTMLAttributes } from 'react'
import type { IconName } from '@/shared/types/icons'
import type { MotionConflictingHandlers } from '@/shared/types/buttonProps'

export type IconButtonShape = 'circle' | 'square'

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'warning'
  | 'error'
  | 'information'

export type IconButtonSize = 'small' | 'medium' | 'large'

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | MotionConflictingHandlers
> {
  icon: IconName
  shape?: IconButtonShape
  variant?: IconButtonVariant
  size?: IconButtonSize
  loading?: boolean
}
