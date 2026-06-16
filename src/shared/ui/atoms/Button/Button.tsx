import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import { type ButtonProps } from '@/shared/types/buttonProps'
import { Spinner, type SpinnerProps } from '../Spinner/Spinner'
import {
  variantColorClasses,
  variantHoverClasses,
  type ButtonVariant,
} from '@/shared/types/buttonVariants'

type LoadingVariant = Record<
  ButtonVariant,
  NonNullable<SpinnerProps['variant']>
>

const loadingVariants: LoadingVariant = {
  primary: 'white',
  secondary: 'gradient',
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
        {
          'flex items-center justify-center gap-2': variant !== 'text',
          'rounded-md shadow-md shadow-black/30': variant !== 'text',
          'hover:shadow-lg': variant !== 'text' && !disabled && !loading,
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
        <IconComponent
          icon={icon}
          className={clsx({
            'h-4 w-4': size === 'small',
            'h-5 w-5': size === 'medium',
            'h-6 w-6': size === 'large',
          })}
        />
      )}
    </button>
  )
}
