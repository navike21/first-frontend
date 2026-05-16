import { createPortal } from 'react-dom'
import type { SelectOptionItem } from '../../Select.types'
import { OptionsList } from '../OptionsList/OptionsList'
import type { RefObject } from 'react'
import { useSelectTexts } from '../../Select.texts'

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

export const SelectDropdownPortal = ({
  dropdownRef,
  idField,
  multiple,
  dropdownStyle,
  search,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  filteredOptions,
  selectedValues,
  handleOptionSelect,
  setFocusedOptionIndex,
}: SelectDropdownPortalProps) => {
  const { searchPlaceholder, searchAriaLabel } = useSelectTexts()

  return createPortal(
    <div // NOSONAR — WAI-ARIA custom combobox: role=listbox required on dropdown container
      ref={dropdownRef}
      id={`${idField}-listbox`}
      role="listbox"
      aria-multiselectable={multiple}
      data-position={dropdownStyle.openAbove ? 'top' : 'bottom'}
      style={{
        position: 'fixed',
        ...(dropdownStyle.openAbove
          ? { bottom: dropdownStyle.bottom }
          : { top: dropdownStyle.top }),
        left: dropdownStyle.left,
        width: dropdownStyle.width,
      }}
      className="z-9999 bg-white rounded-sm shadow-lg ring-1 ring-slate-200 max-h-60 overflow-y-auto"
    >
      {search && (
        <div className="p-2 border-b border-slate-100">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            className="w-full h-8 px-3 text-sm bg-slate-50 rounded-sm border border-slate-200 outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
          />
        </div>
      )}
      <OptionsList
        options={filteredOptions}
        selectedValues={selectedValues}
        multiple={multiple}
        onSelect={handleOptionSelect}
        onFocusIndex={setFocusedOptionIndex}
      />
    </div>,
    document.body,
  )
}
