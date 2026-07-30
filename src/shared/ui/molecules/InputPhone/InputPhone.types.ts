import type { InputHTMLAttributes, ReactNode } from 'react'
import type { variantInput } from '../InputField/InputField.types'

export interface InputPhoneProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'prefix' | 'type' | 'value' | 'defaultValue'
  > {
  classInput?: string
  helperText?: ReactNode
  errorMessage?: ReactNode
  label?: ReactNode
  loading?: boolean
  variant?: variantInput
  /** Fixed, non-editable country-code prefix shown before the number. Default `"+51"` (Peru). */
  prefix?: string
  /**
   * Digit mask for the national number: `#` consumes one digit, other
   * characters are literals. Default `"### ### ###"` (Peru, 9-digit mobile).
   */
  mask?: string
  /** Initial canonical value (raw digits), e.g. from RHF defaults. */
  defaultValue?: string
}
