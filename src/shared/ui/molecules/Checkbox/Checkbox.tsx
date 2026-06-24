import clsx from 'clsx'
import { forwardRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { CheckboxProps } from './Checkbox.types'
import { useCheckbox } from './Checkbox.hooks'
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

    const [isChecked, setIsChecked] = useState(props.checked ?? props.defaultChecked ?? false)
    const isIndeterminate = props.indeterminate ?? false

    useEffect(() => {
      if (props.checked !== undefined) {
        setIsChecked(props.checked)
      }
    }, [props.checked])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      props.onChange?.(e)
    }

    return (
      <ToggleLayout
        label={label}
        disabled={disabled}
        helperText={helperText}
        error={error}
        errorMessage={errorMessage}
        id={idField}
      >
        <motion.button
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
            }
          )}
          whileTap={!disabled ? { scale: 0.9 } : undefined}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          disabled={disabled}
          type="button"
        >
          {/* Checkmark SVG with path drawing */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0 m-auto h-3.5 w-3.5 text-white pointer-events-none"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isChecked && !isIndeterminate ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          </svg>

          {/* Indeterminate (Subtract) SVG with path drawing */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0 m-auto h-3.5 w-3.5 text-white pointer-events-none"
          >
            <motion.path
              d="M5 12H19"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isIndeterminate ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          </svg>

          <input
            ref={resolvedRef}
            type="checkbox"
            id={idField}
            disabled={disabled}
            className={clsx('absolute inset-0 opacity-0', {
              'cursor-not-allowed': disabled,
              'cursor-pointer': !disabled,
            })}
            onChange={handleInputChange}
            {...inputPropsWithoutIndeterminate}
          />
        </motion.button>
      </ToggleLayout>
    )
  }
)

Checkbox.displayName = 'Checkbox'
