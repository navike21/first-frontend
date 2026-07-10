import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { IconButton, IconComponent, Tooltip } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'

export interface ElementShellProps {
  id: string
  icon: IconName
  label: string
  dragLabel: string
  deleteLabel: string
  onDelete: () => void
  children: ReactNode
}

/** Tarjeta base de un elemento dentro de una columna: handle ⠿ + título + eliminar. */
export const ElementShell = ({ id, icon, label, dragLabel, deleteLabel, onDelete, children }: ElementShellProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex flex-col gap-2 rounded-lg border border-border bg-surface p-2.5',
        isDragging && 'opacity-60 ring-1 ring-primary-700/30',
      )}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={dragLabel}
          className="cursor-grab rounded p-0.5 text-muted hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <IconComponent icon="RiDraggable" className="h-3.5 w-3.5" />
        </button>
        <IconComponent icon={icon} className="h-3.5 w-3.5 text-secondary" />
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
        <Tooltip heading={deleteLabel} position="top" size="small">
          <IconButton icon="RiDeleteBinLine" variant="text" size="small" aria-label={deleteLabel} onClick={onDelete} />
        </Tooltip>
      </div>
      {children}
    </div>
  )
}
