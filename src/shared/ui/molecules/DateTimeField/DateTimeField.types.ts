import type { ReactNode } from 'react'
import type { Language } from '@/shared/types/languages'

export type DateTimeFieldVariant = 'default' | 'success' | 'error' | 'warning'

export interface DateTimeFieldProps {
  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode
  variant?: DateTimeFieldVariant
  /** Combined "YYYY-MM-DDTHH:mm" (or '' for empty) — same shape a native
   * datetime-local input produces. */
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  minDate?: string
  maxDate?: string
  disabled?: boolean
  lang?: Language
  name?: string
  className?: string
}
