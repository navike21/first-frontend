import { memo } from 'react'
import type { SelectOptionItem } from '../../Select.types'
import { Chip } from '@/shared/ui'

interface SelectedChipsProps {
  values: string[]
  options: SelectOptionItem[]
  disabled: boolean
  onDeselect: (val: string) => void
}

export const SelectedChips = memo(
  ({ values, options, disabled, onDeselect }: SelectedChipsProps) => {
    return (
      <>
        {values.map((val) => {
          const option = options.find((o) => o.value === val)
          if (!option) return null
          return (
            <Chip
              key={val}
              size="x-small"
              {...(option.icon !== undefined && { icon: option.icon })}
              {...((option.leftSlot ?? option.content) !== undefined && {
                iconContent: option.leftSlot ?? option.content,
              })}
              deleteable={!disabled}
              deleteButtonProps={{
                onClick: (e) => {
                  e.stopPropagation()
                  onDeselect(val)
                },
                'aria-label': `Remove ${option.label}`,
              }}
            >
              {option.label}
            </Chip>
          )
        })}
      </>
    )
  }
)
