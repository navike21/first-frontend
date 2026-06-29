import type { ReactNode } from 'react'
import type { SelectVariant } from '../../Select.types'

export interface SelectFooterProps {
  idField: string
  errorMessage?: ReactNode
  helperText?: ReactNode
  variant: SelectVariant
}
