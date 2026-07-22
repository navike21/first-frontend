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

    const [internalChecked, setInternalChecked] = useState(
      props.defaultChecked ?? false
    )

    // Controlled prop wins over local state; derive during render instead of
    // syncing it in an effect.
    const isChecked = props.checked ?? internalChecked

    // Local input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalChecked(e.target.checked)
      props.onChange?.(e)
    }

    // Document listener to handle unchecking uncontrolled radios in the same group
    useEffect(() => {
      if (props.checked !== undefined) return

      const handleGlobalChange = () => {
        if (resolvedRef.current) {
          setInternalChecked(resolvedRef.current.checked)
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
            'group relative flex h-[18px] w-[18px] items-center justify-center border-none outline-none',
            'duration-fast ease-out-expo transition-all',
            'rounded-full ring-1 ring-inset',
            // Mismo motivo que Checkbox: el input real está anidado y
            // opacity-0 — hay que detectar su foco vía has-[]. El botón
            // lleva tabIndex=-1, no debe ser un tab-stop propio y vacío.
            'has-[input:focus-visible]:shadow-focus-ring',
            {
              'cursor-not-allowed bg-surface-subtle ring-border-control':
                disabled,
              'bg-surface ring-border-control hover:ring-border-hover':
                !disabled,
              'has-[input:checked]:ring-primary-600': !disabled && !error,
              'ring-danger-600 has-[input:checked]:ring-danger-600': error,
            }
          )}
          whileTap={!disabled ? { scale: 0.9 } : undefined}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          disabled={disabled}
          type="button"
          tabIndex={-1}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isChecked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={bounceTransition}
            className={clsx('h-2.5 w-2.5 rounded-full', {
              'bg-primary-600': !disabled && !error,
              'bg-disabled': disabled,
              'bg-danger-600': error,
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
