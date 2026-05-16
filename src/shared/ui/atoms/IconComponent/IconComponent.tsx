import type { IconProps } from '@/shared/types/icons'
import clsx from 'clsx'
import * as RemixIcons from '@remixicon/react'

export const IconComponent = ({ icon, className }: IconProps) => {
  const LucideIconComponent = RemixIcons[icon]

  return <LucideIconComponent data-testid={`icon-${icon}`} className={clsx(className)} />
}
