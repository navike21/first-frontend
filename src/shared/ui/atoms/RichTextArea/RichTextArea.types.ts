import type React from 'react'

export interface RichTextAreaProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  label?: React.ReactNode
  helperText?: string
  errorMessage?: string
  variant?: 'default' | 'error'
  maxLength?: number
  showCount?: boolean
  disabled?: boolean
  minRows?: number
}
