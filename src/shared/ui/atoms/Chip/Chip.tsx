import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconComponent } from '../IconComponent/IconComponent'
import type { ChipProps } from './Chip.types'

export const Chip = ({
  children,
  className = '',
  variant = 'default',
  size = 'medium',
  icon,
  iconContent,
  deleteable = false,
  deleteButtonProps,
}: Readonly<ChipProps>) => {
  return (
    <motion.span
      data-testid="chip"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        className,
        // El manual no lleva ring/borde en ningún chip — solo relleno plano.
        'inline-flex items-center rounded-full font-medium',
        {
          'h-5 gap-1 px-2 text-xs': size === 'x-small',
          'h-6 gap-1 px-2.5 text-xs': size === 'small',
          'h-7 gap-1.5 px-3 text-sm': size === 'medium',
          'h-8 gap-1.5 px-3.5 text-sm': size === 'large',
        },
        {
          'bg-surface-subtle text-secondary': variant === 'default',
          'bg-chip-success-bg text-chip-success-text': variant === 'success',
          'bg-chip-warning-bg text-chip-warning-text': variant === 'warning',
          'bg-chip-info-bg text-chip-info-text': variant === 'informative',
          'bg-chip-error-bg text-chip-error-text': variant === 'error',
        }
      )}
    >
      {icon && (
        <IconComponent
          icon={icon}
          className={clsx({
            'h-3 w-3': size === 'x-small',
            'h-3.5 w-3.5': size === 'small',
            'h-4 w-4': size === 'medium' || size === 'large',
          })}
        />
      )}
      {!icon && iconContent && (
        <span
          className={clsx('flex items-center justify-center overflow-hidden', {
            'h-3 w-3': size === 'x-small',
            'h-3.5 w-3.5': size === 'small',
            'h-4 w-4': size === 'medium' || size === 'large',
          })}
        >
          {iconContent}
        </span>
      )}
      {children}
      {deleteable && (
        <motion.button
          type="button"
          whileHover={deleteButtonProps?.disabled ? undefined : { scale: 1.15 }}
          whileTap={deleteButtonProps?.disabled ? undefined : { scale: 0.85 }}
          className={clsx(
            'inline-flex items-center justify-center rounded-full',
            '-mr-1 ml-0.5',
            'duration-fast ease-out-expo transition-opacity',
            'focus:outline-none',
            {
              'h-3 w-3': size === 'x-small',
              'h-3.5 w-3.5': size === 'small',
              'h-4 w-4': size === 'medium' || size === 'large',
            },
            {
              'cursor-pointer hover:opacity-70': !deleteButtonProps?.disabled,
              'cursor-not-allowed opacity-50': deleteButtonProps?.disabled,
            }
          )}
          {...deleteButtonProps}
        >
          <IconComponent
            icon="RiCloseLine"
            className={clsx({
              'h-3 w-3': size === 'x-small',
              'h-3.5 w-3.5': size === 'small',
              'h-4 w-4': size === 'medium' || size === 'large',
            })}
          />
        </motion.button>
      )}
    </motion.span>
  )
}
