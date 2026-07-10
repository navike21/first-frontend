import type { IconName } from '@/shared/types/icons'

export interface ActionMenuItem {
  id: string
  label: string
  icon: IconName
  onClick: () => void
  /** Destructive item: red styling plus a divider above. */
  danger?: boolean
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  /** Accessible label for the "more actions" trigger button. */
  triggerLabel: string
  disabled?: boolean
}
