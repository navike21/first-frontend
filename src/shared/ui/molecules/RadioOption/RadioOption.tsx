import clsx from 'clsx'
import { forwardRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import type { RadioOptionProps } from './RadioOption.types'
import { useRadioOption } from './RadioOption.hooks'
import { ToggleLayout } from '../../layouts/ToggleLayout/ToggleLayout'
import { bounceTransition } from '@/shared/lib'

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

    const [isChecked, setIsChecked] = useState(
      props.checked ?? props.defaultChecked ?? false
    )

    useEffect(() => {
      if (props.checked !== undefined) {
        setIsChecked(props.checked)
      }
    }, [props.checked])

    // Local input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      props.onChange?.(e)
    }

    // Document listener to handle unchecking uncontrolled radios in the same group
    useEffect(() => {
      if (props.checked !== undefined) return

      const handleGlobalChange = () => {
        if (resolvedRef.current) {
          setIsChecked(resolvedRef.current.checked)
        }
      }

      document.addEventListener('change', handleGlobalChange)
      return () => document.removeEventListener('change', handleGlobalChange)
    }, [props.checked, resolvedRef])

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
            'group relative flex h-5 w-5 items-center justify-center border-none outline-none',
            'duration-fast ease-out-expo transition-all',
            'rounded-full ring-1 ring-inset',
            {
              'cursor-not-allowed bg-slate-200 ring-slate-400 dark:bg-slate-700 dark:ring-slate-600':
                disabled,
              'bg-(--surface) ring-(--border)': !disabled,
              'has-[input:checked]:ring-primary-700 dark:has-[input:checked]:ring-primary-600':
                !disabled && !error,
              'ring-red-500 has-[input:checked]:ring-red-500': error,
            }
          )}
          whileTap={!disabled ? { scale: 0.9 } : undefined}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          disabled={disabled}
          type="button"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isChecked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={bounceTransition}
            className={clsx('h-2.5 w-2.5 rounded-full', {
              'bg-primary-700 dark:bg-primary-600': !disabled && !error,
              'bg-slate-300 dark:bg-slate-600': disabled,
              'bg-red-500': error,
            })}
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
            onChange={handleInputChange}
            {...props}
          />
        </motion.button>
      </ToggleLayout>
    )
  }
)

RadioOption.displayName = 'RadioOption'
