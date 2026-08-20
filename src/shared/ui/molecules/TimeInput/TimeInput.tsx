import clsx from 'clsx'
import { forwardRef, useId } from 'react'
import { InputLayout } from '../../layouts/InputLayout/InputLayout'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import type { TimeInputProps } from './TimeInput.types'

/**
 * Time-of-day picker (HH:mm) — same InputLayout chrome as InputField/InputDate
 * (label/helperText/errorMessage/variant, ring + focus-glow tokens), but wraps
 * the native `<input type="time">` rather than a custom dropdown: it already
 * gives an accessible, keyboard-navigable, OS-native time picker (and a real
 * `<input>` RHF can bind to directly via register()) — pairs with InputDate
 * (date-only) for fields that need day + hour precision (InputDate itself has
 * no time mode).
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
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
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const idField = id ?? generatedId

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
        <div className="flex h-10 min-w-10 items-center justify-center">
          {leftSlot ?? (
            <IconComponent icon="RiTimeLine" className="text-secondary size-5" />
          )}
        </div>
        <input
          id={idField}
          ref={ref}
          {...props}
          type="time"
          className={clsx(
            'h-10 w-full',
            'border-0 border-none bg-transparent text-sm font-normal',
            'duration-fast ease-out-expo transition-all',
            'placeholder:text-muted',
            'focus:border-transparent focus:ring-0 focus:outline-none',
            // The left icon above already communicates "time" — hide the
            // browser's own (WebKit-only) redundant clock glyph.
            '[&::-webkit-calendar-picker-indicator]:hidden',
            !rightSlot && 'pr-[14px]',
            {
              'text-muted cursor-not-allowed': disabled,
              'text-foreground': !disabled,
              'pointer-events-none': loading,
            }
          )}
          disabled={disabled || loading}
          aria-describedby={helperText ? `${idField}-helper-text` : undefined}
        />
        {rightSlot && (
          <div className="flex h-10 min-w-10 items-center justify-center pr-3">
            {rightSlot}
          </div>
        )}
      </InputLayout>
    )
  }
)

TimeInput.displayName = 'TimeInput'
