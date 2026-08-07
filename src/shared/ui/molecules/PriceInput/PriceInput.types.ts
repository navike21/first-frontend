import type { InputHTMLAttributes, ReactNode } from 'react'
import type { variantInput } from '../InputField/InputField.types'

export interface PriceInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'type' | 'value' | 'defaultValue'
> {
  classInput?: string
  helperText?: ReactNode
  errorMessage?: ReactNode
  label?: ReactNode
  loading?: boolean
  variant?: variantInput
  /** Fixed, non-editable currency symbol shown before the amount, e.g. `"$"`, `"S/"`. */
  prefix: string
  /** Allow a leading minus sign (for discounts/adjustments). Default `false`. */
  allowNegative?: boolean
  /** Initial canonical value, major units as a plain decimal string (e.g. `"10.50"`). */
  defaultValue?: string
}
