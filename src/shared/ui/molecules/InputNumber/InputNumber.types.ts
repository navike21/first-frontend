import type { InputFieldProps } from '../InputField/InputField.types'

export interface InputNumberProps
  extends Omit<InputFieldProps, 'type' | 'value' | 'defaultValue'> {
  /** Max decimal places. `0` (default) ⇒ integer only. Ignored when `mask` is set. */
  decimals?: number
  /** Allow a leading minus sign. Default `false`. Ignored when `mask` is set. */
  allowNegative?: boolean
  /** Group the integer part with thousands separators (1,250.90). Default `false`. */
  thousandSeparator?: boolean
  /**
   * Fixed display mask: `#` consumes a digit, other chars are literals
   * (e.g. `+## ### ### ###`, `### ### ###`). When set, the field formats by the
   * mask and stores the raw digits in RHF.
   */
  mask?: string
  /** Initial canonical value (digits / numeric string), e.g. from RHF defaults. */
  defaultValue?: string
}
