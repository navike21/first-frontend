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
  /** Accessible label for the trigger button (also used as its visible text when `triggerText` is set). */
  triggerLabel: string
  disabled?: boolean
  /** Icon for the trigger button. Defaults to the "more actions" (⋮) icon. */
  triggerIcon?: IconName
  /**
   * Renders the trigger as a full-width labeled pill (icon + `triggerLabel`)
   * instead of the default icon-only "more actions" button — for menus that
   * are themselves the primary action (e.g. "Add element"), not a secondary
   * one hanging off a row.
   */
  wide?: boolean
}
