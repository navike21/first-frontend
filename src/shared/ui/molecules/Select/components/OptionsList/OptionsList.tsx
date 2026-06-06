import { memo } from 'react'
import type { SelectOptionItem } from '../../Select.types'
import clsx from 'clsx'
import { useSelectTexts } from '../../Select.texts'
import { IconComponent } from '@/shared/ui'

interface OptionsListProps {
  options: SelectOptionItem[]
  selectedValues: string[]
  multiple: boolean
  onSelect: (val: string) => void
  onFocusIndex: (idx: number) => void
}

export const OptionsList = memo(({
  options,
  selectedValues,
  multiple,
  onSelect,
  onFocusIndex,
}: OptionsListProps) => {
  const { noOptionsFound } = useSelectTexts()

  if (options.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-(--text-muted)">{noOptionsFound}</div>
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
          <button // NOSONAR — WAI-ARIA custom listbox: role=option required on interactive listbox children
            key={opt.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-disabled={opt.disabled}
            data-option
            disabled={opt.disabled}
            onFocus={() => {
              if (!opt.disabled) onFocusIndex(enabledIndex)
            }}
            onClick={() => {
              if (!opt.disabled) onSelect(opt.value)
            }}
            className={clsx(
              'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
              'transition-colors duration-fast ease-out-expo',
              {
                'cursor-pointer': !opt.disabled,
                'cursor-not-allowed opacity-50': opt.disabled,
                'bg-(--surface-subtle)': isSelected && !opt.disabled,
              },
              !opt.disabled && 'hover:bg-(--surface-subtle)',
            )}
          >
            {opt.content && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {opt.content}
              </span>
            )}
            {!opt.content && opt.icon && (
              <IconComponent
                icon={opt.icon}
                className="h-4 w-4 shrink-0 text-(--text-secondary)"
              />
            )}
            <span className="flex-1">{opt.label}</span>
            {multiple && isSelected && (
              <IconComponent
                icon="RiCheckLine"
                className="h-4 w-4 shrink-0 text-(--text-primary)"
              />
            )}
          </button>
        )
      })}
    </>
  )
})
