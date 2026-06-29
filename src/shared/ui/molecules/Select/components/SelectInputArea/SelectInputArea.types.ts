import type { ReactNode, RefObject, KeyboardEvent } from 'react'
import type { SelectOptionItem, SelectVariant } from '../../Select.types'
import type { IconName } from '@/shared/types/icons'
import type { SelectDropdownPortalProps } from '../SelectDropdownPortal/SelectDropdownPortal.types'

export interface SelectInputAreaProps {
  triggerRef: RefObject<HTMLDivElement | null>
  disabled: boolean
  loading: boolean
  isOpen: boolean
  variant: SelectVariant
  isMultipleWithChips: boolean
  classInput?: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  triggerTabIndex: number
  onTriggerClick: (() => void) | undefined
  handleInnerKeyDown: (e: KeyboardEvent<HTMLElement>) => void
  selectedValues: string[]
  options: SelectOptionItem[]
  handleOptionDeselect: (val: string) => void
  singleLabel: string
  singleOption?: SelectOptionItem
  placeholder?: string
  multiple: boolean
  variantIconDef?: { icon: IconName; className: string }
  idField: string
  dropdownRef: RefObject<HTMLDivElement | null>
  dropdownStyle: SelectDropdownPortalProps['dropdownStyle']
  search: boolean
  searchInputRef: RefObject<HTMLInputElement | null>
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredOptions: SelectOptionItem[]
  handleOptionSelect: (val: string) => void
  setFocusedOptionIndex: (i: number) => void
  mounted: boolean
}
