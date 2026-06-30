import type { ReactNode } from 'react'
import { IconComponent } from '@/shared/ui'
import type { SelectOptionItem } from '../Select.types'

type SlotSource = Pick<
  SelectOptionItem,
  'leftSlot' | 'rightSlot' | 'content' | 'icon'
>

/**
 * Resolves the leading visual of an option. Honors the new `leftSlot` first,
 * then the legacy `content`, then falls back to rendering the `icon`.
 */
export const resolveOptionLeftSlot = (option: SlotSource): ReactNode => {
  if (option.leftSlot) return option.leftSlot
  if (option.content) return option.content
  if (option.icon)
    return (
      <IconComponent
        icon={option.icon}
        className="h-4 w-4 shrink-0 text-secondary"
      />
    )
  return null
}

/** Resolves the trailing visual of an option (no legacy fallback). */
export const resolveOptionRightSlot = (option: SlotSource): ReactNode =>
  option.rightSlot ?? null
