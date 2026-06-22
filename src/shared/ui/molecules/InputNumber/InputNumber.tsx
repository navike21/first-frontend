import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react'
import { InputField } from '../InputField/InputField'
import type { InputNumberProps } from './InputNumber.types'
import {
  applyMask,
  digitsOnly,
  formatNumeric,
  maskDigitCount,
  sanitizeNumeric,
  type NumericOptions,
} from './InputNumber.format'

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
 * Numeric input built on {@link InputField}: blocks non-numeric input and
 * formats the *display* (thousands grouping, decimals, or a fixed `mask`) while
 * storing a clean value in the form. Works with React Hook Form via plain
 * `register`.
 *
 * It renders two inputs: a visible {@link InputField} that shows the formatted
 * value, and a hidden input that carries the RHF registration and holds the raw
 * value (RHF reads the registered element's DOM value on submit, so the raw
 * value must live there):
 *
 * - numeric mode → display `1,250.90`, stored value `1250.90`.
 * - mask mode    → display `+51 989 505 027`, stored value `51989505027`.
 *
 * @example
 * <InputNumber {...register('amount')} decimals={2} thousandSeparator />
 * <InputNumber {...register('phone')} mask="+## ### ### ###" />
 */
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      decimals = 0,
      allowNegative = false,
      thousandSeparator = false,
      mask,
      name,
      onChange,
      onBlur,
      defaultValue,
      ...rest
    },
    registerRef
  ) => {
    const opts: NumericOptions = { decimals, allowNegative, thousandSeparator }

    const toRaw = useCallback(
      (v: string): string =>
        mask
          ? digitsOnly(v).slice(0, maskDigitCount(mask))
          : sanitizeNumeric(v, opts),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [mask, decimals, allowNegative]
    )
    const toDisplay = useCallback(
      (raw: string): string =>
        mask ? applyMask(raw, mask) : formatNumeric(raw, opts),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [mask, thousandSeparator]
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
        <InputField
          {...rest}
          type="text"
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode={
            mask || allowNegative || decimals > 0 ? 'decimal' : 'numeric'
          }
        />
      </>
    )
  }
)

InputNumber.displayName = 'InputNumber'
