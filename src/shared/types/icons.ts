import type * as RemixIcons from '@remixicon/react'

export type IconName = keyof typeof RemixIcons

export interface IconProps {
  icon: IconName
  className?: string
}
