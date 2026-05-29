import type { InputHTMLAttributes, ReactNode } from 'react'
import type { Language } from '@/shared/types/languages'

export type DatePickerMode = 'date' | 'month' | 'year' | 'dateRange'
export type InputDateVariant = 'default' | 'success' | 'error' | 'warning'

export interface InputDateTexts {
  clear: string
  today: string
  apply: string
  from: string
  to: string
  placeholder: string
  placeholderFrom: string
  placeholderTo: string
}

/**
 * Shape compatible with react-hook-form's UseFormRegisterReturn.
 * Avoids importing RHF types in the shared UI layer.
 */
export interface InputRegisterLike {
  name?: string
  ref?: React.Ref<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export interface InputDateProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix' | 'type'
> {
  mode?: DatePickerMode

  // Layout
  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode
  variant?: InputDateVariant
  loading?: boolean
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  className?: string
  classInput?: string

  // Single date value (ISO: YYYY-MM-DD) — for mode: date, month, year.
  // Compatible with RHF: spread {...register('field')} to bind name/ref/onChange/onBlur.
  // value / defaultValue / onChange come from InputHTMLAttributes.

  // Range mode — pass register() results for each bound:
  //   fromInput={register('startDate')} toInput={register('endDate')}
  fromInput?: InputRegisterLike
  toInput?: InputRegisterLike

  // Constraints (ISO: YYYY-MM-DD)
  minDate?: string
  maxDate?: string

  // Display format override (date-fns pattern string)
  displayFormat?: string

  // i18n
  lang?: Language
  texts?: Partial<InputDateTexts>
}
