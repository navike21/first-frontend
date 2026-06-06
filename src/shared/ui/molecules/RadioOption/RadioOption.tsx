import clsx from 'clsx'
import { forwardRef } from 'react'
import type { RadioOptionProps } from './RadioOption.types'
import { useRadioOption } from './RadioOption.hooks'
import { ToggleLayout } from '../../layouts/ToggleLayout/ToggleLayout'

export const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  (
    {
      label,
      disabled = false,
      helperText,
      error = false,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const { idField, resolvedRef } = useRadioOption(props, ref)

    return (
      <ToggleLayout
        label={label}
        disabled={disabled}
        helperText={helperText}
        error={error}
        errorMessage={errorMessage}
        id={idField}
      >
        <button
          className={clsx(
            'group relative flex h-5 w-5 items-center justify-center border-none outline-none',
            'transition-all duration-fast ease-out-expo',
            'rounded-full ring-1 ring-inset',
            {
              'cursor-not-allowed bg-slate-200 dark:bg-slate-700 ring-slate-400 dark:ring-slate-600': disabled,
              'bg-(--surface) ring-(--border)': !disabled,
              'has-[input:checked]:ring-slate-700 dark:has-[input:checked]:ring-slate-400': !disabled && !error,
              'ring-red-500 has-[input:checked]:ring-red-500': error,
            }
          )}
          disabled={disabled}
          type="button"
        >
          <div
            className={clsx(
              'h-2.5 w-2.5 rounded-full',
              'transition-all duration-fast ease-out-expo',
              'opacity-0',
              'group-has-[input:checked]:opacity-100',
              {
                'bg-slate-700 dark:bg-slate-400': !disabled && !error,
                'bg-slate-300 dark:bg-slate-600': disabled,
                'bg-red-500': error,
              }
            )}
          />
          <input
            ref={resolvedRef}
            type="radio"
            id={idField}
            disabled={disabled}
            className={clsx('absolute inset-0 opacity-0', {
              'cursor-not-allowed': disabled,
              'cursor-pointer': !disabled,
            })}
            {...props}
          />
        </button>
      </ToggleLayout>
    )
  }
)

RadioOption.displayName = 'RadioOption'
