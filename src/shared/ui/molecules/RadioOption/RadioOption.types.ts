import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'

export interface RadioOptionProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix' | 'onChange' | 'checked'
> {
  label?: ReactNode
  helperText?: ReactNode
  checked?: boolean
  error?: boolean
  errorMessage?: ReactNode
  onChange?: ChangeEventHandler<HTMLInputElement>
}
