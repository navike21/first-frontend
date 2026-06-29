import type { RefObject } from 'react'
import type { IconName } from '@/shared/types/icons'
import type { ButtonBaseProps } from '@/shared/types/buttonProps'

export type PageHeaderButtonAction = {
  type: 'button'
  label: string
  icon?: IconName
  variant?: ButtonBaseProps['variant']
  size?: ButtonBaseProps['size']
  loading?: boolean
  disabled?: boolean
  onClick: () => void
}

export type PageHeaderLinkAction = {
  type: 'link'
  label: string
  to: string
  icon?: IconName
  variant?: ButtonBaseProps['variant']
  size?: ButtonBaseProps['size']
}

export type PageHeaderAction = PageHeaderButtonAction | PageHeaderLinkAction

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: PageHeaderAction[]
  /** Optional ref forwarded to the <h1> for external observers */
  titleRef?: RefObject<HTMLHeadingElement | null>
}
