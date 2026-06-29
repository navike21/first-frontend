import type { HTMLAttributes } from 'react'

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  className?: string
  disabled?: boolean
  htmlFor?: string
}
