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
        // Visual base — el manual no muestra sombra en ninguna card
        'rounded-xl border border-border bg-surface',
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
        { 'hover:border-border-hover': interactive },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
