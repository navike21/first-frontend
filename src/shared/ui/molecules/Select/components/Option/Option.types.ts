import type { ReactNode } from 'react'

export interface OptionProps {
  /** Stable value identifying the option. */
  value: string
  /** Main visible content (already localized by the caller). */
  label: ReactNode
  /** Arbitrary leading visual: flag, avatar, image, icon, badge… */
  leftSlot?: ReactNode
  /** Arbitrary trailing visual: badge, shortcut hint, meta… */
  rightSlot?: ReactNode
  disabled?: boolean
  /** Whether the option is currently selected. */
  selected: boolean
  /** Render the multi-select check on the trailing edge. */
  showCheck?: boolean
  onSelect: (value: string) => void
  onFocus?: () => void
}
