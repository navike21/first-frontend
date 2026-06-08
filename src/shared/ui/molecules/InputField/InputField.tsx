import clsx from 'clsx'
import { forwardRef } from 'react'
import type { InputFieldProps } from './InputField.types'
import { useInputField } from './InputField.hooks'
import { InputLayout } from '../../layouts/InputLayout/InputLayout'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      classInput = '',
      className = '',
      disabled = false,
      errorMessage = '',
      helperText,
      label = '',
      leftSlot,
      loading = false,
      rightSlot,
      type = 'text',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const {
      idField,
      showPassword,
      typeField,
      handleClassSlot,
      handleChangeTypePassword,
    } = useInputField({ type, ...props })

    return (
      <InputLayout
        classInput={classInput}
        className={className}
        disabled={disabled}
        helperText={helperText}
        id={idField}
        label={label}
        loading={loading}
        variant={variant}
        errorMessage={errorMessage}
      >
        {type === 'password' && (
          <div className={clsx('flex min-w-10 items-center justify-center')}>
            <IconComponent
              icon="RiLockPasswordFill"
              className="size-5 text-(--text-primary)"
            />
          </div>
        )}
        {type === 'email' && (
          <div className={clsx('flex min-w-10 items-center justify-center')}>
            <IconComponent
              icon="RiMailFill"
              className="size-5 text-(--text-primary)"
            />
          </div>
        )}
        {leftSlot && (
          <div className={handleClassSlot(type, 'left')}>{leftSlot}</div>
        )}
        <input
          id={idField}
          ref={ref}
          {...props}
          className={clsx(
            'h-10 w-full',
            'border-0 border-none bg-transparent text-sm font-normal',
            'duration-fast ease-out-expo transition-all',
            'placeholder:text-(--text-muted)',
            'focus:border-transparent focus:ring-0 focus:outline-none',
            {
              'px-4 py-2': !leftSlot && !rightSlot && type === 'text',
              'py-2 pr-4': !leftSlot && !rightSlot && type === 'email',
              'py-2 pr-1': !leftSlot && !rightSlot && type === 'password',
              'pr-4': leftSlot && !rightSlot && type !== 'password',
              'pr-1': leftSlot && !rightSlot && type === 'password',
              'pl-4': rightSlot && !leftSlot,
              'cursor-not-allowed text-(--text-secondary)': disabled,
              'text-(--text-primary)': !disabled,
              'pointer-events-none': loading,
            }
          )}
          disabled={disabled || loading}
          type={typeField}
          aria-describedby={helperText ? `${idField}-helper-text` : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            className={clsx(
              'flex h-10 min-w-10 items-center justify-center outline-none',
              'duration-fast ease-out-expo transition-all',
              'active:scale-90',
              {
                'cursor-pointer hover:bg-(--surface-subtle)': !disabled,
                'cursor-not-allowed': disabled,
              }
            )}
            disabled={disabled}
            onClick={handleChangeTypePassword}
          >
            <IconComponent
              icon={showPassword ? 'RiEyeOffFill' : 'RiEyeFill'}
              className="size-4 text-(--text-secondary)"
            />
          </button>
        )}
        {rightSlot && type !== 'password' && (
          <div className={handleClassSlot(type, 'right')}>{rightSlot}</div>
        )}
      </InputLayout>
    )
  }
)

InputField.displayName = 'InputField'
