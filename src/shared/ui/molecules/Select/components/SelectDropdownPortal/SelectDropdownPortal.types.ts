import type { RefObject } from 'react'
import type { SelectOptionItem } from '../../Select.types'

export interface SelectDropdownPortalProps {
  dropdownRef: RefObject<HTMLDivElement | null>
  idField: string
  multiple: boolean
  dropdownStyle: {
    top: number
    bottom: number
    left: number
    width: number
    openAbove: boolean
  }
  search: boolean
  searchInputRef: RefObject<HTMLInputElement | null>
  searchQuery: string
  filteredOptions: SelectOptionItem[]
  selectedValues: string[]
  handleOptionSelect: (v: string) => void
  setSearchQuery: (q: string) => void
  setFocusedOptionIndex: (i: number) => void
}
