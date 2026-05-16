import { hasTextClassColor } from '@/shared/lib/hasTextClassColor'
import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  className?: string
  disabled?: boolean
  htmlFor?: string
}

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
      'text-sm font-semibold transition-all duration-300',
      {
        'cursor-not-allowed text-slate-500': disabled,
        'text-slate-900': !disabled && !hasTextClassColor(className),
      }
    )}
  >
    {children}
  </label>
)
