import type { ReactNode } from 'react'

export interface SortableMediaTileProps {
  /** Sortable id (dnd-kit) — normally the media URL. */
  id: string
  src: string
  kind: 'image' | 'video'
  posterUrl?: string
  dragLabel: string
  removeLabel: string
  onRemove: () => void
  /**
   * 'whole' (default) makes the entire tile the drag surface — for a plain
   * thumbnail grid (e.g. a slider). 'handle' renders a separate corner
   * drag-button instead, needed when `footer` adds its own interactive
   * content (e.g. an alt-text input) that would otherwise fight the drag
   * gesture's pointer-event capture.
   */
  dragMode?: 'whole' | 'handle'
  /** Extra content rendered below the tile (e.g. a gallery image's alt-text input). */
  footer?: ReactNode
}
