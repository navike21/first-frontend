import { Tooltip } from '../Tooltip'
import { IconButton } from '../../atoms/IconButton'
import { IconComponent } from '../../atoms/IconComponent'
import type { SortableItemActionsProps } from './SortableItemActions.types'

/** Encabezado de una fila reordenable (dnd-kit `useSortable`): handle de
 * arrastre + botón de eliminar, ambos con tooltip. Para items de lista
 * cuyo drag-handle vive en una fila propia (no superpuesto sobre una
 * miniatura — ver `GalleryElementCard`'s `GalleryTile` para ese otro
 * patrón, que no usa este componente). */
export const SortableItemActions = ({ dragLabel, removeLabel, attributes, listeners, onRemove }: SortableItemActionsProps) => (
  <div className="flex items-center gap-1">
    <Tooltip heading={dragLabel} position="top" size="small">
      <button
        type="button"
        aria-label={dragLabel}
        className="cursor-grab rounded p-0.5 text-muted hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <IconComponent icon="RiDraggable" className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
    <span className="flex-1" />
    <Tooltip heading={removeLabel} position="top" size="small">
      <IconButton icon="RiDeleteBinLine" variant="text" size="small" aria-label={removeLabel} onClick={onRemove} />
    </Tooltip>
  </div>
)
