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
import { applyMask, digitsOnly, maskDigitCount } from '../InputNumber/InputNumber.format'
import type { InputPhoneProps } from './InputPhone.types'

const DEFAULT_MASK = '### ### ###' // Peru, 9-digit mobile number
const DEFAULT_PREFIX = '+51'

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
 * Phone number input: a fixed, non-editable country-code prefix (mono font,
 * bordered divider — per the Design System's Teléfono spec) followed by a
 * digit-only, auto-formatted national number. Built directly on
 * `InputLayout` (like `InputField`) rather than through `InputField`'s
 * generic `leftSlot`, since the prefix needs its own divider/typography that
 * the shared slot doesn't provide. Works with React Hook Form via plain
 * `register`, same dual-input trick as `InputNumber`.
 *
 * @example
 * <InputPhone {...register('phone')} />
 */
export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
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
      prefix = DEFAULT_PREFIX,
      mask = DEFAULT_MASK,
      name,
      onChange,
      onBlur,
      defaultValue,
      ...rest
    },
    registerRef
  ) => {
    const toRaw = useCallback(
      (v: string): string => digitsOnly(v).slice(0, maskDigitCount(mask)),
      [mask]
    )
    const toDisplay = useCallback(
      (raw: string): string => applyMask(raw, mask),
      [mask]
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
            inputMode="numeric"
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

InputPhone.displayName = 'InputPhone'
