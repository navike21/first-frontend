import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'

export interface SortableItemActionsProps {
  dragLabel: string
  removeLabel: string
  /** `attributes`/`listeners` de `useSortable({ id })` (dnd-kit) del item. */
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
  onRemove: () => void
}
