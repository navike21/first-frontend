import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[--color-foreground]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-[--color-muted]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={[
              'h-10 w-full rounded-[--radius-md] border border-[--color-border]',
              'bg-[--color-card] px-3 text-sm text-[--color-foreground]',
              'placeholder:text-[--color-muted]',
              'transition-colors duration-[--transition-fast]',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-0 focus:border-[--color-primary]',
              'disabled:pointer-events-none disabled:opacity-50',
              error ? 'border-[--color-danger] focus:ring-[--color-danger]' : '',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-[--color-muted]">{rightIcon}</span>}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[--color-danger]">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[--color-muted]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
