import type { InputHTMLAttributes, ReactNode } from 'react'

export type SwitchSize = 'small' | 'medium' | 'large'

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode
  error?: boolean
  size?: SwitchSize
}
