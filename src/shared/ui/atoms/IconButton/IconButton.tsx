import clsx from 'clsx'
import { motion } from 'framer-motion'
import { IconComponent } from '../IconComponent/IconComponent'
import { Spinner, type SpinnerProps } from '../Spinner/Spinner'
import {
  variantColorClasses,
  variantHoverClasses,
  variantHasShadow,
  iconSizeClasses,
} from '@/shared/types/buttonVariants'
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

const shapeClasses: Record<IconButtonShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}

const sizePaddingClasses: Record<IconButtonSize, string> = {
  small: 'p-2',
  medium: 'p-3',
  large: 'p-4',
}

export const IconButton = ({
  icon,
  shape = 'circle',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: Readonly<IconButtonProps>) => {
  const canInteract = !disabled && !loading

  return (
    <motion.button
      className={clsx(
        className,
        'inline-flex items-center justify-center',
        shapeClasses[shape],
        sizePaddingClasses[size],
        'font-medium',
        variantColorClasses[variant],
        'duration-fast ease-out-expo transition-all',
        {
          'shadow-md shadow-black/30': variantHasShadow[variant],
        },
        {
          'hover:shadow-lg': variantHasShadow[variant] && !disabled && !loading,
          'active:scale-95': !disabled && !loading,
          'hover:bg-(--surface-subtle)':
            variant === 'text' && !disabled && !loading,
        },
        !disabled && !loading && variantHoverClasses[variant],
        {
          'cursor-pointer': !disabled && !loading,
          'cursor-wait': loading,
          'cursor-not-allowed opacity-50 shadow-none': disabled,
        }
      )}
      whileTap={canInteract ? { scale: 0.95 } : undefined}
      {...props}
      disabled={loading || disabled}
      aria-label={props['aria-label']}
    >
      {loading ? (
        <Spinner variant={loadingVariants[variant]} size="small" />
      ) : (
        <IconComponent icon={icon} className={iconSizeClasses[size]} />
      )}
    </motion.button>
  )
}
