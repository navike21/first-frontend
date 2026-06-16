import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix' | 'onChange' | 'checked'
> {
  label?: ReactNode
  helperText?: ReactNode
  checked?: boolean
  error?: boolean
  errorMessage?: ReactNode
  indeterminate?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}
