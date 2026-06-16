import clsx from 'clsx'
import { forwardRef } from 'react'
import type { SwitchProps, SwitchSize } from './Switch.types'
import { useSwitchHook } from './Switch.hooks'
import { ToggleLayout } from '../../layouts/ToggleLayout/ToggleLayout'

// Track dimensions: height × width
const TRACK_CLS: Record<SwitchSize, string> = {
  small: 'h-5 w-9', // 20 × 36 px
  medium: 'h-6 w-11', // 24 × 44 px
  large: 'h-8 w-14', // 32 × 56 px
}

// Thumb diameter
const THUMB_CLS: Record<SwitchSize, string> = {
  small: 'size-3.5', // 14 px
  medium: 'size-[18px]',
  large: 'size-6', // 24 px
}

// Thumb resting left offset
const THUMB_OFFSET_CLS: Record<SwitchSize, string> = {
  small: 'left-[3px]',
  medium: 'left-[3px]',
  large: 'left-1',
}

// Travel = track_w - thumb_d - 2×pad → sm: 16 px, md: 20 px, lg: 24 px
const THUMB_TRANSLATE_CLS: Record<SwitchSize, string> = {
  small: 'group-has-[input:checked]:translate-x-4',
  medium: 'group-has-[input:checked]:translate-x-5',
  large: 'group-has-[input:checked]:translate-x-6',
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      disabled = false,
      helperText,
      error = false,
      errorMessage,
      size = 'medium',
      ...props
    },
    ref
  ) => {
    const { idField } = useSwitchHook(props)

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
          type="button"
          disabled={disabled}
          className={clsx(
            'group relative shrink-0 border-none p-0 outline-none',
            'rounded-full bg-slate-300 dark:bg-slate-600',
            'duration-fast ease-spring transition-all',
            'has-[input:checked]:bg-primary-500',
            TRACK_CLS[size],
            {
              'cursor-not-allowed opacity-60': disabled,
              'cursor-pointer': !disabled,
            }
          )}
        >
          <span
            className={clsx(
              'pointer-events-none absolute top-1/2 -translate-y-1/2',
              'rounded-full bg-white shadow-sm dark:bg-slate-100',
              'duration-fast ease-spring transition-all',
              THUMB_CLS[size],
              THUMB_OFFSET_CLS[size],
              THUMB_TRANSLATE_CLS[size]
            )}
          />
          <input
            ref={ref}
            type="checkbox"
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

Switch.displayName = 'Switch'
