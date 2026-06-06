import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import { Spinner, type SpinnerProps } from '../Spinner/Spinner'
import type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonShape,
  IconButtonSize,
} from './IconButton.types'

type LoadingVariant = Record<
  IconButtonVariant,
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

const variantColorClasses: Record<IconButtonVariant, string> = {
  primary: 'bg-primary-950 text-white',
  secondary: 'text-(--text-primary) bg-(--surface) ring-1 ring-black dark:ring-slate-600 ring-inset',
  text: 'text-(--text-primary) bg-transparent',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
  information: 'bg-blue-600 text-white',
}

const variantHoverClasses: Record<IconButtonVariant, string> = {
  primary: 'hover:bg-gray-800',
  secondary: 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:ring-2',
  text: '',
  warning: 'hover:bg-amber-600',
  error: 'hover:bg-red-700',
  information: 'hover:bg-blue-700',
}

const shapeClasses: Record<IconButtonShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}

const sizePaddingClasses: Record<IconButtonSize, string> = {
  small: 'p-2',
  medium: 'p-3',
  large: 'p-4',
}

const sizeIconClasses: Record<IconButtonSize, string> = {
  small: 'h-4 w-4',
  medium: 'h-5 w-5',
  large: 'h-6 w-6',
}

export const IconButton = ({
  icon,
  shape = 'square',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: Readonly<IconButtonProps>) => {
  return (
    <button
      className={clsx(
        className,
        'inline-flex items-center justify-center',
        shapeClasses[shape],
        sizePaddingClasses[size],
        'font-medium',
        variantColorClasses[variant],
        'transition-all duration-fast ease-out-expo',
        {
          'shadow-md shadow-black/30': variant !== 'text',
        },
        {
          'hover:shadow-lg': variant !== 'text' && !disabled && !loading,
          'active:scale-95': !disabled && !loading,
          'hover:bg-(--surface-subtle)': variant === 'text' && !disabled && !loading,
        },
        !disabled && !loading && variantHoverClasses[variant],
        {
          'cursor-pointer': !disabled && !loading,
          'cursor-wait': loading,
          'cursor-not-allowed opacity-50 shadow-none': disabled,
        }
      )}
      {...props}
      disabled={loading || disabled}
      aria-label={props['aria-label']}
    >
      {loading ? (
        <Spinner variant={loadingVariants[variant]} size="small" />
      ) : (
        <IconComponent icon={icon} className={sizeIconClasses[size]} />
      )}
    </button>
  )
}
