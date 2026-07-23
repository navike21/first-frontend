import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { IconButton, IconComponent, Tooltip } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'

export interface ElementShellProps {
  id: string
  sectionId: string
  columnId: string
  icon: IconName
  label: string
  dragLabel: string
  editLabel: string
  deleteLabel: string
  onEdit: () => void
  onDelete: () => void
  children: ReactNode
}

/** Tarjeta base de un elemento: handle ⠿ + icono de tipo + acciones (iconos
 * con tooltip). El contenido es un preview; la edición ocurre en modal. */
export const ElementShell = ({
  id,
  sectionId,
  columnId,
  icon,
  label,
  dragLabel,
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
  children,
}: ElementShellProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { kind: 'element', sectionId, columnId },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'group border-border bg-surface flex flex-col gap-1.5 rounded-lg border p-2',
        isDragging && 'ring-primary-700/30 opacity-60 ring-1'
      )}
    >
      <div className="flex items-center gap-1">
        <Tooltip heading={dragLabel} position="top" size="small">
          <button
            type="button"
            aria-label={dragLabel}
            className="text-muted hover:text-foreground cursor-grab rounded p-0.5 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <IconComponent icon="RiDraggable" className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
        <IconComponent icon={icon} className="text-secondary h-3.5 w-3.5" />
        <span className="text-muted flex-1 text-[10px] font-medium tracking-wide uppercase">
          {label}
        </span>
        <Tooltip heading={editLabel} position="top" size="small">
          <IconButton
            icon="RiPencilLine"
            variant="text"
            size="small"
            aria-label={editLabel}
            onClick={onEdit}
          />
        </Tooltip>
        <Tooltip heading={deleteLabel} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={deleteLabel}
            onClick={onDelete}
          />
        </Tooltip>
      </div>
      {children}
    </div>
  )
}
