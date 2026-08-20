import type { InputHTMLAttributes, ReactNode } from 'react'

export type TimeInputVariant = 'default' | 'success' | 'error' | 'warning'

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'prefix' | 'suffix'> {
  classInput?: string
  helperText?: ReactNode
  errorMessage?: ReactNode
  label?: ReactNode
  leftSlot?: ReactNode
  loading?: boolean
  rightSlot?: ReactNode
  variant?: TimeInputVariant
}
