import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MediaThumbnail } from '../../atoms/MediaThumbnail'
import { IconComponent } from '../../atoms/IconComponent'
import type { SortableMediaTileProps } from './SortableMediaTile.types'

/** Sortable image/video thumbnail with a corner remove button, for grids
 * built with dnd-kit's `useSortable` (page builder's gallery and slider
 * widgets). See `dragMode` for the two supported drag-handle shapes. */
export const SortableMediaTile = ({
  id,
  src,
  kind,
  posterUrl,
  dragLabel,
  removeLabel,
  onRemove,
  dragMode = 'whole',
  footer,
}: SortableMediaTileProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const isWholeTileDrag = dragMode === 'whole'

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...(isWholeTileDrag ? attributes : {})}
      {...(isWholeTileDrag ? listeners : {})}
      className={clsx(
        'flex flex-col gap-1.5 rounded-lg',
        footer && 'border border-border bg-surface-subtle p-1.5',
        isWholeTileDrag && 'touch-none cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50',
      )}
    >
      <div
        className={clsx(
          'relative aspect-square overflow-hidden rounded-md',
          !footer && 'border border-border bg-surface-subtle',
        )}
      >
        <MediaThumbnail src={src} kind={kind} posterSrc={posterUrl} className="h-full w-full object-cover" />
        {!isWholeTileDrag && (
          <button
            type="button"
            aria-label={dragLabel}
            className="absolute top-1 left-1 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-surface/90 text-muted ring-1 ring-border active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <IconComponent icon="RiDraggable" className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onPointerDown={isWholeTileDrag ? (e) => e.stopPropagation() : undefined}
          onClick={(e) => {
            if (isWholeTileDrag) e.stopPropagation()
            onRemove()
          }}
          aria-label={removeLabel}
          className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-danger-600 text-white ring-2 ring-surface transition-colors hover:bg-danger-600/90"
        >
          <IconComponent icon="RiDeleteBinLine" className="h-3.5 w-3.5" />
        </button>
      </div>
      {footer}
    </div>
  )
}
