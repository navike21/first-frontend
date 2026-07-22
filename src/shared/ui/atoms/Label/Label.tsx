import { hasTextClassColor } from '@/shared/lib/hasTextClassColor'
import clsx from 'clsx'
import type { LabelProps } from './Label.types'

export const Label = ({
  children,
  className,
  disabled,
  htmlFor,
  ...props
}: LabelProps) => (
  <label
    {...props}
    htmlFor={htmlFor}
    className={clsx(
      className,
      'text-sm font-semibold',
      'duration-fast ease-out-expo transition-all',
      {
        'text-disabled cursor-not-allowed': disabled,
        'text-foreground': !disabled && !hasTextClassColor(className),
      }
    )}
  >
    {children}
  </label>
)
