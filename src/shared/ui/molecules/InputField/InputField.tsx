import clsx from 'clsx'
import { forwardRef } from 'react'
import { motion } from 'motion/react'
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
            'placeholder:text-muted',
            'focus:border-transparent focus:ring-0 focus:outline-none',
            {
              'py-[11px] px-[14px]': !leftSlot && !rightSlot && type !== 'password',
              'py-[11px] pl-[14px] pr-1': !leftSlot && type === 'password',
              'pr-[14px]': leftSlot && !rightSlot && type !== 'password',
              'pr-1': leftSlot && type === 'password',
              'pl-[14px]': rightSlot && !leftSlot,
              'cursor-not-allowed text-muted': disabled,
              'text-foreground': !disabled,
              'pointer-events-none': loading,
            }
          )}
          disabled={disabled || loading}
          type={typeField}
          aria-describedby={helperText ? `${idField}-helper-text` : undefined}
        />
        {type === 'password' && (
          <motion.button
            type="button"
            whileTap={disabled ? undefined : { scale: 0.9 }}
            className={clsx(
              'flex h-10 min-w-10 items-center justify-center outline-none',
              'duration-fast ease-out-expo transition-all',
              'active:scale-90',
              {
                'cursor-pointer hover:bg-surface-subtle': !disabled,
                'cursor-not-allowed': disabled,
              }
            )}
            disabled={disabled}
            onClick={handleChangeTypePassword}
          >
            <IconComponent
              icon={showPassword ? 'RiEyeOffFill' : 'RiEyeFill'}
              className="size-4 text-secondary"
            />
          </motion.button>
        )}
        {rightSlot && type !== 'password' && (
          <div className={handleClassSlot(type, 'right')}>{rightSlot}</div>
        )}
      </InputLayout>
    )
  }
)

InputField.displayName = 'InputField'
