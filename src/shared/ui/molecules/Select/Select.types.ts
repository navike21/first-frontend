import type { IconName } from '@/shared/types/icons'
import type { Language } from '@/shared/types/languages'
import type { ReactNode, SelectHTMLAttributes } from 'react'

export interface SelectOptionItem {
  label: string
  value: string
  disabled?: boolean
  icon?: IconName
  content?: ReactNode
}

export type SelectVariant = 'default' | 'success' | 'error' | 'warning'

export interface SelectTexts {
  noOptionsFound: string
  searchPlaceholder: string
  searchAriaLabel: string
  openOptionsAriaLabel: string
  closeOptionsAriaLabel: string
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'prefix' | 'suffix' | 'multiple'
> {
  className?: string
  classInput?: string
  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode
  variant?: SelectVariant
  loading?: boolean
  options: SelectOptionItem[]
  multiple?: boolean
  search?: boolean
  placeholder?: string
  lang?: Language
  texts?: Partial<SelectTexts>
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}
