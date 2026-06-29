import type { ReactNode } from 'react'

export interface ToggleLayoutProps {
  children: ReactNode
  disabled?: boolean
  errorMessage?: ReactNode
  error?: boolean
  helperText?: ReactNode
  id?: string
  label?: ReactNode
}
