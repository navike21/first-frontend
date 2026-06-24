import clsx from 'clsx'
import { forwardRef } from 'react'
import type { CheckboxProps } from './Checkbox.types'
import { useCheckbox } from './Checkbox.hooks'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { ToggleLayout } from '../../layouts/ToggleLayout/ToggleLayout'

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
    const { idField, resolvedRef, inputPropsWithoutIndeterminate } =
      useCheckbox(props, ref)

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
            'group relative flex h-5 w-5 items-center justify-center border-none p-px outline-none',
            'duration-fast ease-spring transition-all',
            'rounded-sm ring-1 ring-inset',
            'has-[input:checked]:ring-10',
            'has-[input:indeterminate]:ring-10',
            {
              'cursor-not-allowed bg-slate-200 ring-slate-400 dark:bg-slate-700 dark:ring-slate-600':
                disabled,
              'ring-slate-30 bg-(--surface)': !disabled,
              'has-[input:checked]:ring-slate-700 has-[input:indeterminate]:ring-slate-700 dark:has-[input:checked]:ring-slate-400 dark:has-[input:indeterminate]:ring-slate-400':
                !disabled && !error,
              'ring-red-500 has-[input:checked]:ring-red-500 has-[input:indeterminate]:ring-red-500':
                error,
              'active:scale-90': !disabled,
            }
          )}
          disabled={disabled}
          type="button"
        >
          <IconComponent
            icon="RiCheckFill"
            className={clsx(
              'absolute inset-0 m-auto h-full w-full',
              'text-white',
              'duration-fast ease-spring transition-all',
              'scale-50 opacity-0',
              'group-has-[input:checked]:scale-100 group-has-[input:checked]:opacity-100',
              'group-has-[input:indeterminate]:scale-50 group-has-[input:indeterminate]:opacity-0'
            )}
          />

          <IconComponent
            icon="RiSubtractFill"
            className={clsx(
              'absolute inset-0 m-auto h-full w-full',
              'text-white',
              'duration-fast ease-spring transition-all',
              'scale-50 opacity-0',
              'group-has-[input:indeterminate]:scale-100 group-has-[input:indeterminate]:opacity-100',
              'group-has-[input:checked]:scale-50 group-has-[input:checked]:opacity-0'
            )}
          />

          <input
            ref={resolvedRef}
            type="checkbox"
            id={idField}
            disabled={disabled}
            className={clsx('absolute inset-0 opacity-0', {
              'cursor-not-allowed': disabled,
              'cursor-pointer': !disabled,
            })}
            {...inputPropsWithoutIndeterminate}
          />
        </button>
      </ToggleLayout>
    )
  }
)

Checkbox.displayName = 'Checkbox'
