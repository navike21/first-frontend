import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconComponent } from '../IconComponent/IconComponent'
import { type ButtonProps } from '@/shared/types/buttonProps'
import { Spinner } from '../Spinner/Spinner'
import type { SpinnerProps } from '../Spinner/Spinner.types'
import {
  variantColorClasses,
  variantHoverClasses,
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
  ghost: 'gradient',
  text: 'default',
  destructive: 'gradient',
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
  // Default to a non-submitting button so a Button inside a <form> never
  // submits by accident; submit buttons opt in with type="submit".
  type = 'button',
  ...props
}: Readonly<ButtonProps>) => {
  const canInteract = !disabled && !loading

  return (
    <motion.button
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
        variant !== 'text' && buttonShapeClass,
        {
          'active:scale-95': variant !== 'text' && !disabled && !loading,
        },
        // Disabled reemplaza el color del variant por el gris plano del
        // manual (bg #E3E8F0 / texto #9AA4B5, sin borde) — no es un fade de
        // opacidad sobre el color del variant. `text` queda fuera (no es
        // uno de los 4 botones del Design System).
        disabled && variant !== 'text' && 'cursor-not-allowed bg-border-control text-muted',
        disabled && variant === 'text' && 'cursor-not-allowed opacity-50',
        !disabled && [
          variantColorClasses[variant],
          !loading && variantHoverClasses[variant],
          // Loading atenúa el botón entero (opacity 0.85 del manual), no
          // solo el texto.
          loading && 'opacity-85',
        ],
        {
          'before:duration-fast before:ease-out-expo before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0 before:-translate-x-1/2 before:bg-muted before:opacity-0 before:transition-all before:content-[""]':
            variant === 'text',
          'hover:before:w-full hover:before:opacity-100':
            variant === 'text' && !loading,
        },
        variant === 'text' ? textSizeClasses[size] : sizeClasses[size],
        {
          'inline-flex align-middle': variant === 'text' && loading,
        }
      )}
      whileTap={canInteract ? { scale: 0.96 } : undefined}
      type={type}
      {...props}
      disabled={loading || disabled}
    >
      <div>{children}</div>
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
    </motion.button>
  )
}
