import type { ReactNode } from 'react'
import { IconComponent } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'

export interface MediaCardProps {
  file: StorageFile
  /** Secondary line under the file name (formatted size, or a trash "deleted at" caption). */
  caption?: string
  /** Icon-button actions rendered at the bottom of the card (Ver/Eliminar/Restaurar/Purgar…). */
  actions?: ReactNode
}

/** Card content for a single file — the `renderItem` passed to `MediaGrid` on both the Multimedia list and its trash. */
export const MediaCard = ({ file, caption, actions }: MediaCardProps) => (
  <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-2">
    <div className="flex h-24 items-center justify-center overflow-hidden rounded-md bg-surface-subtle">
      {file.isImage ? (
        <img
          src={file.thumb?.url ?? file.full?.url ?? file.original.url}
          alt={file.originalName}
          className="h-full w-full object-cover"
        />
      ) : (
        <IconComponent icon="RiVideoLine" className="h-8 w-8 text-muted" />
      )}
    </div>
    <span className="truncate text-[11px] font-medium text-foreground" title={file.originalName}>
      {file.originalName}
    </span>
    {caption && <span className="truncate text-[10px] text-muted">{caption}</span>}
    {actions && <div className="flex items-center justify-end gap-0.5">{actions}</div>}
  </div>
)
