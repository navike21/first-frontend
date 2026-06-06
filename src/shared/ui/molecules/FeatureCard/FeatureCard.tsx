import clsx from 'clsx'
import { Card } from '../../atoms/Card/Card'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { type IconProps } from '@/shared/types/icons'
import { Link } from '@tanstack/react-router'

export interface FeatureCardProps {
  title: string
  description: string
  icon: IconProps['icon']
  href: string
  className?: string
}

export const FeatureCard = ({
  title,
  description,
  icon,
  href,
  className,
}: FeatureCardProps) => {
  return (
    <Link to={href} className={clsx('block h-full group', 'focus:outline-none')}>
      <Card
        className={clsx(
          'flex h-full flex-col',
          'border-(--border-subtle)',
          'transition-all duration-fast ease-out-expo',
          'hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
        padding="large"
      >
        <div className="flex flex-col gap-4">
          <div className={clsx(
            'flex h-10 w-10 items-center justify-center',
            'rounded-md bg-primary-700 text-white',
          )}>
            <IconComponent icon={icon} className="h-5 w-5" />
          </div>
          <div>
            <h3 className={clsx(
              'mb-1',
              'text-base font-bold leading-snug text-(--text-primary)',
              'transition-colors',
              'group-hover:text-primary-600 dark:group-hover:text-primary-400',
            )}>
              {title}
            </h3>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
