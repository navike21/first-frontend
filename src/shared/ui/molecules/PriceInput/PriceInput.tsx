import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react'
import clsx from 'clsx'
import { InputLayout } from '../../layouts/InputLayout/InputLayout'
import {
  formatNumeric,
  sanitizeNumeric,
  type NumericOptions,
} from '../InputNumber/InputNumber.format'
import type { PriceInputProps } from './PriceInput.types'

/** Sets an input's value via the native setter so React/RHF observe the change. */
function setNativeValue(node: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )?.set
  setter?.call(node, value)
  node.dispatchEvent(new Event('input', { bubbles: true }))
}

/**
 * Money amount input: a fixed, non-editable currency-symbol prefix (mono
 * font, bordered divider) followed by a thousands-grouped, 2-decimal number.
 * Built directly on `InputLayout` (like `InputPhone`) rather than through
 * `InputNumber`, since the prefix needs its own divider/typography that
 * `InputNumber` doesn't expose a slot for. Stores/returns major units as a
 * plain decimal string (e.g. `"10.50"`) — converting to/from the backend's
 * integer-cents `Money.amount` is the caller's responsibility (the same
 * schema/payload-mapper layer that already handles other field shape
 * differences), not this component's.
 *
 * @example
 * <PriceInput {...register('price')} prefix={currencySymbol(currency, lang)} />
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  (
    {
      className,
      classInput,
      disabled = false,
      errorMessage,
      helperText,
      id,
      label,
      loading = false,
      variant = 'default',
      prefix,
      allowNegative = false,
      name,
      onChange,
      onBlur,
      defaultValue,
      ...rest
    },
    registerRef
  ) => {
    const opts: NumericOptions = {
      decimals: 2,
      allowNegative,
      thousandSeparator: true,
    }

    const toRaw = useCallback(
      (v: string): string => sanitizeNumeric(v, opts),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [allowNegative]
    )
    const toDisplay = useCallback(
      (raw: string): string => formatNumeric(raw, opts),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    const initialRaw = toRaw(String(defaultValue ?? ''))
    const [display, setDisplay] = useState(() => toDisplay(initialRaw))
    const hiddenRef = useRef<HTMLInputElement | null>(null)

    const setHiddenRef = useCallback(
      (node: HTMLInputElement | null) => {
        hiddenRef.current = node
        if (typeof registerRef === 'function') registerRef(node)
        else if (registerRef) registerRef.current = node
      },
      [registerRef]
    )

    // Sync the display from the raw value RHF injects into the hidden input
    // (e.g. edit defaults) on mount.
    useEffect(() => {
      if (hiddenRef.current) {
        setDisplay(toDisplay(toRaw(hiddenRef.current.value)))
      }
    }, [toRaw, toDisplay])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = toRaw(e.target.value)
      setDisplay(toDisplay(raw))
      if (hiddenRef.current) setNativeValue(hiddenRef.current, raw)
    }

    // Forward blur to RHF (touched state) using the registered hidden input.
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      if (hiddenRef.current && onBlur) {
        onBlur({
          ...e,
          target: hiddenRef.current,
          currentTarget: hiddenRef.current,
        })
      }
    }

    return (
      <>
        <input
          ref={setHiddenRef}
          type="text"
          name={name}
          defaultValue={initialRaw}
          onChange={onChange}
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
        />
        <InputLayout
          className={className}
          classInput={classInput}
          disabled={disabled}
          errorMessage={errorMessage}
          helperText={helperText}
          id={id}
          label={label}
          loading={loading}
          variant={variant}
        >
          <span
            className={clsx(
              'border-border-control flex h-10 shrink-0 items-center border-r px-3 font-mono text-sm',
              disabled ? 'text-muted' : 'text-secondary'
            )}
          >
            {prefix}
          </span>
          <input
            {...rest}
            id={id}
            type="text"
            inputMode="decimal"
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || loading}
            className={clsx(
              'h-10 w-full px-[14px]',
              'border-0 bg-transparent text-sm font-normal',
              'duration-fast ease-out-expo transition-all',
              'placeholder:text-muted',
              'focus:border-transparent focus:ring-0 focus:outline-none',
              disabled ? 'text-muted cursor-not-allowed' : 'text-foreground',
              loading && 'pointer-events-none'
            )}
          />
        </InputLayout>
      </>
    )
  }
)

PriceInput.displayName = 'PriceInput'
