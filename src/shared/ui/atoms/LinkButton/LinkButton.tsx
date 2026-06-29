import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import { type LinkButtonProps } from '@/shared/types/buttonProps'
import {
  variantColorClasses,
  variantHoverClasses,
  variantHasShadow,
  buttonShapeClass,
  sizeClasses,
  textSizeClasses,
  iconSizeClasses,
} from '@/shared/types/buttonVariants'
import { Link } from '@tanstack/react-router'

export const LinkButton = ({
  variant = 'primary',
  className = '',
  children,
  size = 'medium',
  icon,
  loading: _loading,
  fullWidth: _fullWidth,
  ...props
}: Readonly<LinkButtonProps>) => (
  <Link
    className={clsx(
      className,
      'duration-fast ease-out-expo relative w-full cursor-pointer font-medium transition-all',
      'sm:w-fit',
      variant !== 'text' && buttonShapeClass,
      {
        'shadow-md shadow-black/30': variantHasShadow[variant],
        'hover:shadow-lg': variantHasShadow[variant],
        'active:scale-95': variant !== 'text',
      },
      variantColorClasses[variant],
      variantHoverClasses[variant],
      {
        'before:duration-fast before:ease-out-expo before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-slate-400 before:opacity-0 before:transition-all before:content-[""]':
          variant === 'text',
        'hover:before:w-full hover:before:opacity-100': variant === 'text',
      },
      variant === 'text' ? textSizeClasses[size] : sizeClasses[size]
    )}
    {...props}
  >
    {children}
    {icon && <IconComponent icon={icon} className={iconSizeClasses[size]} />}
  </Link>
)
