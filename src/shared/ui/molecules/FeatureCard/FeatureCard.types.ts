import type { IconProps } from '@/shared/types/icons'

export interface FeatureCardProps {
  title: string
  description: string
  icon: IconProps['icon']
  href: string
  className?: string
}
