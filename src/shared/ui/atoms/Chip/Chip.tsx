import clsx from 'clsx'
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
    <span
      data-testid="chip"
      className={clsx(
        className,
        'inline-flex items-center rounded-full font-medium ring-1',
        {
          'h-5 gap-1 px-2 text-xs': size === 'x-small',
          'h-6 gap-1 px-2.5 text-xs': size === 'small',
          'h-7 gap-1.5 px-3 text-sm': size === 'medium',
          'h-8 gap-1.5 px-3.5 text-sm': size === 'large',
        },
        {
          'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-600': variant === 'default',
          'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-300 dark:ring-emerald-700':
            variant === 'success',
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-yellow-300 dark:ring-yellow-700':
            variant === 'warning',
          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-300 dark:ring-blue-700': variant === 'informative',
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-300 dark:ring-red-700': variant === 'error',
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
        <button
          type="button"
          className={clsx(
            'inline-flex items-center justify-center rounded-full',
            '-mr-1 ml-0.5',
            'transition-opacity duration-fast ease-out-expo',
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
        </button>
      )}
    </span>
  )
}
