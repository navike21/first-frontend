import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import { type ButtonProps } from '@/shared/types/buttonProps'
import { Spinner, type SpinnerProps } from '../Spinner/Spinner'
import {
  variantColorClasses,
  variantHoverClasses,
  variantHasShadow,
  buttonShapeClass,
  sizeClasses,
  textSizeClasses,
  iconSizeClasses,
  type ButtonVariant,
} from '@/shared/types/buttonVariants'

type LoadingVariant = Record<
  ButtonVariant,
  NonNullable<SpinnerProps['variant']>
>

const loadingVariants: LoadingVariant = {
  primary: 'white',
  secondary: 'gradient',
  outline: 'gradient',
  text: 'default',
  warning: 'white',
  error: 'white',
  information: 'white',
}

export const Button = ({
  children,
  className = '',
  disabled = false,
  size = 'medium',
  variant = 'primary',
  icon,
  loading = false,
  fullWidth = false,
  ...props
}: Readonly<ButtonProps>) => {
  return (
    <button
      className={clsx(
        className,
        'relative w-full',
        'font-medium',
        'duration-fast ease-out-expo transition-all',
        {
          'w-full': fullWidth,
          'sm:w-full': fullWidth,
          'sm:w-fit': !fullWidth,
        },
        {
          'cursor-pointer': !disabled && !loading,
        },
        {
          'cursor-wait': loading,
        },
        {
          'cursor-not-allowed opacity-50 shadow-none': disabled,
        },
        variant !== 'text' && buttonShapeClass,
        {
          'shadow-md shadow-black/30': variantHasShadow[variant],
          'hover:shadow-lg':
            variantHasShadow[variant] && !disabled && !loading,
          'active:scale-95': variant !== 'text' && !disabled && !loading,
        },
        variantColorClasses[variant],
        !disabled && !loading && variantHoverClasses[variant],
        {
          'before:duration-fast before:ease-out-expo before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-(--text-muted) before:opacity-0 before:transition-all before:content-[""]':
            variant === 'text',
          'hover:before:w-full hover:before:opacity-100':
            variant === 'text' && !loading,
        },
        variant === 'text' ? textSizeClasses[size] : sizeClasses[size],
        {
          'inline-flex align-middle': variant === 'text' && loading,
        }
      )}
      {...props}
      disabled={loading || disabled}
    >
      <div
        className={clsx({
          'opacity-70': loading,
        })}
      >
        {children}
      </div>
      {loading && (
        <div
          className={clsx('min-w-5', {
            'pl-2.5': variant === 'text',
          })}
        >
          <Spinner variant={loadingVariants[variant]} size="small" />
        </div>
      )}
      {icon && !loading && (
        <IconComponent icon={icon} className={iconSizeClasses[size]} />
      )}
    </button>
  )
}
