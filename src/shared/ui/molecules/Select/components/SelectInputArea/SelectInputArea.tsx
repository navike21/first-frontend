import type { SelectOptionItem, SelectVariant } from '../../Select.types'
import { getInputAreaClass } from '../../helper/getInputAreaClass'
import clsx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import { SelectedChips } from '../SelectedChips/SelectedChips'
import { TriggerDisplay } from '../TriggerDisplay/TriggerDisplay'
import {
  SelectDropdownPortal,
  type SelectDropdownPortalProps,
} from '../SelectDropdownPortal/SelectDropdownPortal'
import { useSelectTexts } from '../../Select.texts'
import type { IconName } from '@/shared/types/icons'
import { IconComponent, Spinner } from '@/shared/ui'

interface SelectInputAreaProps {
  triggerRef: React.RefObject<HTMLDivElement | null>
  disabled: boolean
  loading: boolean
  isOpen: boolean
  variant: SelectVariant
  isMultipleWithChips: boolean
  classInput?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  triggerTabIndex: number
  onTriggerClick: (() => void) | undefined
  handleInnerKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void
  selectedValues: string[]
  options: SelectOptionItem[]
  handleOptionDeselect: (val: string) => void
  singleLabel: string
  singleOption?: SelectOptionItem
  placeholder?: string
  multiple: boolean
  variantIconDef?: { icon: IconName; className: string }
  idField: string
  dropdownRef: React.RefObject<HTMLDivElement | null>
  dropdownStyle: SelectDropdownPortalProps['dropdownStyle']
  search: boolean
  searchInputRef: React.RefObject<HTMLInputElement | null>
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredOptions: SelectOptionItem[]
  handleOptionSelect: (val: string) => void
  setFocusedOptionIndex: (i: number) => void
  mounted: boolean
}

export const SelectInputArea = ({
  triggerRef,
  disabled,
  loading,
  isOpen,
  variant,
  isMultipleWithChips,
  classInput,
  leftSlot,
  rightSlot,
  triggerTabIndex,
  onTriggerClick,
  handleInnerKeyDown,
  selectedValues,
  options,
  handleOptionDeselect,
  singleLabel,
  singleOption,
  placeholder,
  multiple,
  variantIconDef,
  idField,
  dropdownRef,
  dropdownStyle,
  search,
  searchInputRef,
  searchQuery,
  setSearchQuery,
  filteredOptions,
  handleOptionSelect,
  setFocusedOptionIndex,
  mounted,
}: SelectInputAreaProps) => {
  const { openOptionsAriaLabel, closeOptionsAriaLabel } = useSelectTexts()

  return (
    <div ref={triggerRef} className="relative">
      {/* Custom input area */}
      <div
        className={getInputAreaClass({
          disabled,
          isOpen,
          variant,
          isMultipleWithChips,
          ...(classInput !== undefined && { classInput }),
        })}
      >
        {leftSlot && (
          <div className="flex h-10 min-w-10 shrink-0 items-center justify-center">
            {leftSlot}
          </div>
        )}
        {/* Trigger area — combobox role is required by WAI-ARIA custom select pattern */}
        <div // NOSONAR — WAI-ARIA custom combobox: role=combobox required on trigger element
          role="combobox"
          tabIndex={triggerTabIndex}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${idField}-listbox`}
          onClick={onTriggerClick}
          onKeyDown={handleInnerKeyDown}
          className={clsx(
            'flex min-h-10 flex-1 flex-wrap items-center gap-1 px-3 py-1.5',
            {
              'cursor-pointer': !disabled && !loading,
              'cursor-not-allowed': disabled,
            }
          )}
        >
          {multiple && (
            <SelectedChips
              values={selectedValues}
              options={options}
              disabled={disabled}
              onDeselect={handleOptionDeselect}
            />
          )}

          {(!multiple || selectedValues.length === 0) && (
            <TriggerDisplay
              singleLabel={singleLabel}
              {...(singleOption !== undefined && { singleOption })}
              {...(placeholder !== undefined && { placeholder })}
            />
          )}
        </div>

        {/* Caret button */}
        <button
          type="button"
          onClick={onTriggerClick}
          disabled={disabled}
          className={clsx(
            'flex h-10 min-w-10 shrink-0 items-center justify-center outline-none',
            'duration-fast ease-out-expo transition-all',
            {
              'cursor-pointer': !disabled && !loading,
              'cursor-not-allowed': disabled,
            }
          )}
          aria-label={isOpen ? closeOptionsAriaLabel : openOptionsAriaLabel}
        >
          <IconComponent
            icon={isOpen ? 'RiArrowUpSLine' : 'RiArrowDownSLine'}
            className="size-5 text-(--text-primary)"
          />
        </button>

        {rightSlot && (
          <div className="flex h-10 min-w-10 shrink-0 items-center justify-center">
            {rightSlot}
          </div>
        )}

        {/* Loading / variant icons */}
        {loading && (
          <div className="mr-3 min-w-5">
            <Spinner variant="gradient" size="small" />
          </div>
        )}
        {variantIconDef && (
          <IconComponent
            icon={variantIconDef.icon}
            className={variantIconDef.className}
          />
        )}
      </div>

      {/* Dropdown portal — escapes overflow/clip ancestors */}
      {typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? (
        isOpen && mounted && (
          <SelectDropdownPortal
            dropdownRef={dropdownRef}
            idField={idField}
            multiple={multiple}
            dropdownStyle={dropdownStyle}
            search={search}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredOptions={filteredOptions}
            selectedValues={selectedValues}
            handleOptionSelect={handleOptionSelect}
            setFocusedOptionIndex={setFocusedOptionIndex}
          />
        )
      ) : (
        <AnimatePresence>
          {isOpen && mounted && (
            <SelectDropdownPortal
              dropdownRef={dropdownRef}
              idField={idField}
              multiple={multiple}
              dropdownStyle={dropdownStyle}
              search={search}
              searchInputRef={searchInputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredOptions={filteredOptions}
              selectedValues={selectedValues}
              handleOptionSelect={handleOptionSelect}
              setFocusedOptionIndex={setFocusedOptionIndex}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
