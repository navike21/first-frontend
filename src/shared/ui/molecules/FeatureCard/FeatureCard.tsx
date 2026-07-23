import clsx from 'clsx'
import { Card } from '../../atoms/Card/Card'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Link } from '@tanstack/react-router'
import type { FeatureCardProps } from './FeatureCard.types'

export const FeatureCard = ({
  title,
  description,
  icon,
  href,
  className,
}: FeatureCardProps) => {
  return (
    <Link
      to={href}
      className={clsx('group block h-full', 'focus:outline-none')}
    >
      <Card
        className={clsx(
          'flex h-full flex-col',
          'border-border-subtle',
          'duration-fast ease-out-expo transition-all',
          'hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
        padding="large"
      >
        <div className="flex flex-col gap-4">
          <div
            className={clsx(
              'flex h-10 w-10 items-center justify-center',
              'bg-primary-600 rounded-md text-white'
            )}
          >
            <IconComponent icon={icon} className="h-5 w-5" />
          </div>
          <div>
            <h3
              className={clsx(
                'mb-1',
                'text-foreground text-base leading-snug font-bold',
                'transition-colors',
                'group-hover:text-primary-600 dark:group-hover:text-primary-400'
              )}
            >
              {title}
            </h3>
            <p className="text-secondary text-xs leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
