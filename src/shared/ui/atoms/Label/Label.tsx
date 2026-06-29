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
        'cursor-not-allowed text-(--text-secondary)': disabled,
        'text-(--text-primary)': !disabled && !hasTextClassColor(className),
      }
    )}
  >
    {children}
  </label>
)
