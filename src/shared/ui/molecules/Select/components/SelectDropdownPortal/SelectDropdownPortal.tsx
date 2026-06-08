import { createPortal } from 'react-dom'
import clsx from 'clsx'
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
      className={clsx(
        'z-[9999] max-h-60 origin-top overflow-y-auto',
        'rounded-sm bg-(--surface) shadow-lg ring-1 ring-(--border)',
        'animate-dropdown-in'
      )}
    >
      {search && (
        <div className="border-b border-(--border-subtle) p-2">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            className={clsx(
              'h-8 w-full px-3',
              'rounded-sm border border-(--border) bg-(--surface-subtle) text-sm outline-none',
              'focus:ring-1 focus:ring-(--border)',
              'placeholder:text-(--text-muted)'
            )}
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
    document.body
  )
}
