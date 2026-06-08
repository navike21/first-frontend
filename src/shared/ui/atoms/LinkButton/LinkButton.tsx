import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import { type LinkButtonProps } from '@/shared/types/buttonProps'
import { variantColorClasses, variantHoverClasses } from '@/shared/types/buttonVariants'
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
      'relative w-full cursor-pointer font-medium transition-all duration-fast ease-out-expo',
      'sm:w-fit',
      {
        'flex items-center justify-center gap-2 rounded-md shadow-md shadow-black/30':
          variant !== 'text',
        'hover:shadow-lg': variant !== 'text',
        'active:scale-95': variant !== 'text',
      },
      variantColorClasses[variant],
      variantHoverClasses[variant],
      {
        'before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-slate-400 before:opacity-0 before:transition-all before:duration-fast before:ease-out-expo before:content-[""]':
          variant === 'text',
        'hover:before:w-full hover:before:opacity-100': variant === 'text',
      },
      {
        'text-xs': size === 'small' && variant === 'text',
        'text-sm': size === 'medium' && variant === 'text',
        'text-md': size === 'large' && variant === 'text',
      },
      {
        'px-6 py-3 text-xs': size === 'small' && variant !== 'text',
        'px-8 py-3.5 text-sm': size === 'medium' && variant !== 'text',
        'text-md px-10 py-4': size === 'large' && variant !== 'text',
      },
    )}
    {...props}
  >
    {children}
    {icon && (
      <IconComponent
        icon={icon}
        className={clsx({
          'h-4 w-4': size === 'small',
          'h-5 w-5': size === 'medium',
          'h-6 w-6': size === 'large',
        })}
      />
    )}
  </Link>
)
