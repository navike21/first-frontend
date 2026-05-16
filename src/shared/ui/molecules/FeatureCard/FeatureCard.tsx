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
    <Link to={href} className="block h-full group focus:outline-none">
      <Card 
        className={clsx(
          'flex flex-col h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-fast ease-out-expo border-gray-100',
          className
        )} 
        padding="large"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-700 text-white">
            <IconComponent icon={icon} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-snug mb-1 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
