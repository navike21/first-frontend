import { IconComponent } from '@/shared/ui'
import clsx from 'clsx'
import type { SelectOptionItem } from '../../Select.types'

interface TriggerDisplayProps {
  singleOption?: SelectOptionItem
  singleLabel: string
  placeholder?: string
}

export const TriggerDisplay = ({
  singleOption,
  singleLabel,
  placeholder,
}: TriggerDisplayProps) => (
  <span className="flex items-center gap-1.5">
    {singleOption?.content && (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {singleOption.content}
      </span>
    )}
    {!singleOption?.content && singleOption?.icon && (
      <IconComponent
        icon={singleOption.icon}
        className="h-4 w-4 shrink-0 text-(--text-secondary)"
      />
    )}
    <span
      className={clsx('text-sm', {
        'text-(--text-primary)': singleLabel,
        'text-(--text-muted)': !singleLabel,
      })}
    >
      {singleLabel || placeholder || ''}
    </span>
  </span>
)
