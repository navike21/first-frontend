import clsx from 'clsx'
import type { CardProps } from './Card.types'

export const Card = ({
  children,
  className,
  padding = 'medium',
  interactive = false,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        // Visual base
        'rounded-xl border border-(--border) bg-(--surface) shadow-sm',
        // Transitions
        'duration-fast ease-out-expo transition-all',
        // Sizing
        {
          'p-0': padding === 'none',
          'p-4': padding === 'small',
          'p-6': padding === 'medium',
          'p-8': padding === 'large',
        },
        // Hover (interactive)
        { 'hover:border-gray-300 hover:shadow-md': interactive },
        // Dark hover (interactive)
        { 'dark:hover:border-slate-500': interactive },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
