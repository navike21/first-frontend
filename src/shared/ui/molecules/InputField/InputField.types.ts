import type { InputHTMLAttributes, ReactNode } from 'react'

export type TypeInput = 'text' | 'email' | 'password' | 'date' | 'datetime-local'
export type variantInput = 'default' | 'success' | 'error' | 'warning'

export interface InputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix'
> {
  classInput?: string
  helperText?: ReactNode
  errorMessage?: ReactNode
  label?: ReactNode
  leftSlot?: ReactNode
  loading?: boolean
  rightSlot?: ReactNode
  type?: TypeInput
  variant?: variantInput
}
