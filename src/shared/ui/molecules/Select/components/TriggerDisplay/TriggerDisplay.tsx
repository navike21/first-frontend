import clsx from 'clsx'
import type { SelectOptionItem } from '../../Select.types'
import {
  resolveOptionLeftSlot,
  resolveOptionRightSlot,
} from '../../helper/optionSlots'

interface TriggerDisplayProps {
  singleOption?: SelectOptionItem
  singleLabel: string
  placeholder?: string
}

export const TriggerDisplay = ({
  singleOption,
  singleLabel,
  placeholder,
}: TriggerDisplayProps) => {
  const leftSlot = singleOption ? resolveOptionLeftSlot(singleOption) : null
  const rightSlot = singleOption ? resolveOptionRightSlot(singleOption) : null

  return (
    <span className="flex items-center gap-1.5">
      {leftSlot && <span className="flex shrink-0 items-center">{leftSlot}</span>}
      <span
        data-select-trigger-label
        className={clsx('text-sm', {
          'text-(--text-primary)': singleLabel,
          'text-(--text-muted)': !singleLabel,
        })}
      >
        {singleLabel || placeholder || ''}
      </span>
      {rightSlot && (
        <span className="flex shrink-0 items-center">{rightSlot}</span>
      )}
    </span>
  )
}
