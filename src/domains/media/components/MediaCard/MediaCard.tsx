import type { ReactNode } from 'react'
import { MediaThumbnail } from '@/shared/ui'
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
  <div className="border-border bg-surface flex flex-col gap-1.5 rounded-lg border p-2">
    <div className="bg-surface-subtle flex aspect-square items-center justify-center overflow-hidden rounded-md">
      <MediaThumbnail
        src={
          file.isImage
            ? (file.thumb?.url ?? file.full?.url ?? file.original.url)
            : file.original.url
        }
        kind={file.isImage ? 'image' : 'video'}
        posterSrc={
          file.isImage ? undefined : (file.thumb?.url ?? file.full?.url)
        }
        entityId={file.id}
        alt={file.originalName}
        className="h-full w-full object-cover"
      />
    </div>
    <span
      className="text-foreground truncate text-[11px] font-medium"
      title={file.originalName}
    >
      {file.originalName}
    </span>
    {caption && (
      <span className="text-muted truncate text-[10px]">{caption}</span>
    )}
    {actions && (
      <div className="flex items-center justify-end gap-0.5">{actions}</div>
    )}
  </div>
)
