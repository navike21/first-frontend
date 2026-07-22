import clsx from 'clsx'
import {
  resolveOptionLeftSlot,
  resolveOptionRightSlot,
} from '../../helper/optionSlots'
import type { TriggerDisplayProps } from './TriggerDisplay.types'

export const TriggerDisplay = ({
  singleOption,
  singleLabel,
  placeholder,
  disabled = false,
}: TriggerDisplayProps) => {
  const leftSlot = singleOption ? resolveOptionLeftSlot(singleOption) : null
  const rightSlot = singleOption ? resolveOptionRightSlot(singleOption) : null

  return (
    <span className="flex items-center gap-1.5">
      {leftSlot && (
        <span className="flex shrink-0 items-center">{leftSlot}</span>
      )}
      <span
        data-select-trigger-label
        className={clsx('text-sm', {
          'text-foreground': singleLabel && !disabled,
          'text-muted': !singleLabel || disabled,
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
