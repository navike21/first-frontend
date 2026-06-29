import clsx from 'clsx'
import { useId, type ReactNode } from 'react'
import { Label } from '../../atoms/Label/Label'
import { Spinner } from '../../atoms/Spinner/Spinner'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { HelperText } from '../../atoms/HelperText/HelperText'

export interface InputLayoutProps {
  className?: string
  classInput?: string
  children?: ReactNode
  disabled?: boolean
  errorMessage?: ReactNode
  helperText?: ReactNode
  id?: string
  label?: ReactNode
  loading?: boolean
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export const InputLayout = ({
  className,
  classInput,
  children,
  disabled = false,
  errorMessage,
  helperText,
  id,
  label,
  loading,
  variant = 'default',
}: InputLayoutProps) => {
  const generatedId = useId()
  const idField = id ?? generatedId

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-1',
        {
          'cursor-not-allowed': disabled,
          'pointer-events-none': loading,
        },
        className
      )}
    >
      {label && (
        <Label disabled={disabled} htmlFor={idField}>
          {label}
        </Label>
      )}
      <div
        className={clsx(
          'content-input',
          'flex h-10 w-full items-center',
          'rounded-sm',
          'duration-fast ease-out-expo transition-all',
          'focus-within:shadow-sm focus-within:ring-2',
          {
            'bg-slate-400/50 dark:bg-slate-600/50': disabled,
            'bg-(--surface) ring-1 ring-inset': !disabled,
            'focus-within:ring-primary-600 dark:focus-within:ring-primary-400 ring-(--border)':
              variant === 'default' && !disabled,
            'ring-emerald-500 focus-within:ring-emerald-600':
              variant === 'success' && !disabled,
            'ring-red-500 focus-within:ring-red-600':
              variant === 'error' && !disabled,
            'ring-yellow-500 focus-within:ring-yellow-600':
              variant === 'warning' && !disabled,
          },
          classInput
        )}
      >
        {children}
        {loading && (
          <div className="mr-3 min-w-5">
            <Spinner variant="gradient" size="small" />
          </div>
        )}
        {variant === 'success' && !loading && (
          <IconComponent
            icon="RiCheckboxCircleFill"
            className="mr-3 size-5 text-emerald-500"
          />
        )}
        {variant === 'error' && !loading && (
          <IconComponent
            icon="RiErrorWarningFill"
            className="mr-3 size-5 text-red-500"
          />
        )}
        {variant === 'warning' && !loading && (
          <IconComponent
            icon="RiErrorWarningFill"
            className="mr-3 size-5 text-yellow-500"
          />
        )}
      </div>
      {errorMessage && variant === 'error' && (
        <HelperText
          idField={idField}
          variant="error"
          className="absolute -bottom-5 left-0"
        >
          {errorMessage}
        </HelperText>
      )}
      {helperText && variant !== 'error' && (
        <HelperText
          idField={idField}
          variant={variant}
          className="absolute top-[calc(100%+4px)] left-0"
        >
          {helperText}
        </HelperText>
      )}
    </div>
  )
}
