import type { TextareaHTMLAttributes, ReactNode } from 'react'

export type TextAreaVariant = 'default' | 'success' | 'error' | 'warning'

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode
  variant?: TextAreaVariant
  /** Extra classes for the bordered field container. */
  classInput?: string
  /**
   * Show a live character counter. Pairs with `maxLength`; the counter reacts
   * (color) as the limit is approached (≥90% → warning) and reached (red).
   */
  showCount?: boolean
}
