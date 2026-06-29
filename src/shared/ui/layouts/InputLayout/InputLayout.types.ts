import type { ReactNode } from 'react'

export interface InputLayoutProps {
  className?: string
  classInput?: string
  children?: ReactNode
  disabled?: boolean
  errorMessage?: ReactNode
  helperText?: ReactNode
  id?: string
  label?: ReactNode
  loading?: boolean
  variant?: 'default' | 'success' | 'error' | 'warning'
}
