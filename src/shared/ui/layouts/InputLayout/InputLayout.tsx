import clsx from 'clsx'
import { useId } from 'react'
import { Label } from '../../atoms/Label/Label'
import { Spinner } from '../../atoms/Spinner/Spinner'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { HelperText } from '../../atoms/HelperText/HelperText'
import type { InputLayoutProps } from './InputLayout.types'

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
          'rounded-control',
          'duration-fast ease-out-expo transition-all',
          'focus-within:ring-2',
          {
            'focus-within:shadow-focus-ring':
              variant === 'default' && !disabled,
          },
          {
            'bg-surface-subtle': disabled,
            'bg-surface-input ring-1 ring-inset': !disabled,
            'ring-border-control hover:ring-border-hover focus-within:ring-primary-600!':
              variant === 'default' && !disabled,
            'ring-emerald-500 focus-within:ring-emerald-600':
              variant === 'success' && !disabled,
            'ring-danger-600 focus-within:ring-danger-600':
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
            className="text-danger-600 mr-3 size-5"
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
