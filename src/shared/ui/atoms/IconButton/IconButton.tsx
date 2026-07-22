import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconComponent } from '../IconComponent/IconComponent'
import { Spinner } from '../Spinner/Spinner'
import type { SpinnerProps } from '../Spinner/Spinner.types'
import {
  variantColorClasses,
  variantHoverClasses,
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
  destructive: 'gradient',
}

const shapeClasses: Record<IconButtonShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-control',
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
        'duration-fast ease-out-expo transition-all',
        {
          'active:scale-95': !disabled && !loading,
          'hover:bg-surface-subtle':
            variant === 'text' && !disabled && !loading,
        },
        // Mismo criterio que Button: disabled reemplaza el color (gris
        // plano), no lo atenúa con opacidad — excepto en `text`, fuera del
        // alcance del Design System.
        disabled && variant !== 'text' && 'bg-border-control text-muted',
        disabled && variant === 'text' && 'opacity-50',
        !disabled && [
          variantColorClasses[variant],
          !loading && variantHoverClasses[variant],
          loading && 'opacity-85',
        ],
        {
          'cursor-pointer': !disabled && !loading,
          'cursor-wait': loading,
          'cursor-not-allowed': disabled,
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
