import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { OptionsList } from '../OptionsList/OptionsList'
import { useSelectTexts } from '../../Select.texts'
import type { SelectDropdownPortalProps } from './SelectDropdownPortal.types'

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
    <motion.div // NOSONAR — WAI-ARIA custom combobox: role=listbox required on dropdown container
      ref={dropdownRef}
      id={`${idField}-listbox`}
      role="listbox"
      aria-multiselectable={multiple}
      data-position={dropdownStyle.openAbove ? 'top' : 'bottom'}
      initial={{
        opacity: 0,
        scaleY: 0.95,
        y: dropdownStyle.openAbove ? 4 : -4,
      }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.95, y: dropdownStyle.openAbove ? 4 : -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        transformOrigin: dropdownStyle.openAbove ? 'bottom' : 'top',
        position: 'fixed',
        ...(dropdownStyle.openAbove
          ? { bottom: dropdownStyle.bottom }
          : { top: dropdownStyle.top }),
        left: dropdownStyle.left,
        width: dropdownStyle.width,
      }}
      className={clsx(
        'z-[9999] flex max-h-60 flex-col',
        'rounded-select bg-surface-panel ring-border-control ring-1',
        dropdownStyle.openAbove ? 'shadow-panel-up' : 'shadow-panel-down'
      )}
    >
      {search && (
        <div className="border-border-subtle shrink-0 border-b p-2">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            className={clsx(
              'h-8 w-full px-3',
              'rounded-control border-border-control bg-surface-input border text-sm outline-none',
              'focus:ring-border-control focus:ring-1',
              'placeholder:text-muted'
            )}
          />
        </div>
      )}
      <div className="overflow-y-auto">
        <OptionsList
          options={filteredOptions}
          selectedValues={selectedValues}
          multiple={multiple}
          onSelect={handleOptionSelect}
          onFocusIndex={setFocusedOptionIndex}
        />
      </div>
    </motion.div>,
    document.body
  )
}
