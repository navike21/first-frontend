import { memo } from 'react'
import { useSelectTexts } from '../../Select.texts'
import { Option } from '../Option/Option'
import {
  resolveOptionLeftSlot,
  resolveOptionRightSlot,
} from '../../helper/optionSlots'
import type { OptionsListProps } from './OptionsList.types'

export const OptionsList = memo(
  ({
    options,
    selectedValues,
    multiple,
    onSelect,
    onFocusIndex,
  }: OptionsListProps) => {
    const { noOptionsFound } = useSelectTexts()

    if (options.length === 0) {
      return (
        <div className="px-3 py-2 text-sm text-(--text-muted)">
          {noOptionsFound}
        </div>
      )
    }
    // Pre-compute enabled index map once per render — O(n) instead of O(n²)
    const enabledIndexMap = new Map(
      options.filter((o) => !o.disabled).map((o, i) => [o.value, i] as const)
    )
    return (
      <>
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value)
          const enabledIndex = enabledIndexMap.get(opt.value) ?? -1
          return (
            <Option
              key={opt.value}
              value={opt.value}
              label={opt.label}
              leftSlot={resolveOptionLeftSlot(opt)}
              rightSlot={resolveOptionRightSlot(opt)}
              disabled={opt.disabled}
              selected={isSelected}
              showCheck={multiple && isSelected}
              onSelect={onSelect}
              onFocus={() => onFocusIndex(enabledIndex)}
            />
          )
        })}
      </>
    )
  }
)
