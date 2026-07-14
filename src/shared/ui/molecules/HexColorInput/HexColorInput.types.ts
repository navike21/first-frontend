import type { ReactNode } from 'react'

export interface HexColorInputProps {
  label: ReactNode
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  errorMessage?: string
}
