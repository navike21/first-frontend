import type { ReactNode } from 'react'
import type { Language } from '@/shared/types/languages'
import type { SelectOptionItem } from '../Select/Select.types'

export interface FilterBarSearch {
  value: string
  onChange: (value: string) => void
  label?: ReactNode
  placeholder?: string
}

export interface FilterBarFilter {
  /** Stable key for the filter (also used as the React list key). */
  id: string
  label?: ReactNode
  options: SelectOptionItem[]
  value: string
  onChange: (value: string) => void
  /** Tailwind width class for this filter's wrapper. Default `"w-full sm:w-52"`. */
  widthClassName?: string
}

export interface FilterBarProps {
  /** Search field, shown first and taking the remaining row width (`flex-1`). Omit to show only filters. */
  search?: FilterBarSearch
  /** One `Select` per entry, in order. */
  filters?: FilterBarFilter[]
  /** Drives each `Select`'s built-in i18n texts. */
  lang?: Language
  className?: string
}
