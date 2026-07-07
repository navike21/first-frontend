export interface GalleryItem {
  /** Stable id for dnd-kit and React keys: the URL itself for existing photos, a generated id for new ones. */
  key: string
  kind: 'existing' | 'new'
  /** Display URL: the real URL for existing photos, a blob: preview URL for new ones. */
  url: string
  /** Only present for kind:'new' — the picked file, uploaded on submit. */
  file?: File
}

export interface GalleryPickerProps {
  items: GalleryItem[]
  onItemsChange: (items: GalleryItem[]) => void
  uploadLabel?: string
  dragLabel?: string
  removeLabel?: string
  formatsHint?: string
  /** Shown once the gallery is at maxItems, in place of formatsHint. */
  maxItemsHint?: string
  /** External validation error (e.g. from a submit attempt). */
  errorMessage?: string
  disabled?: boolean
  /** Max number of photos. Defaults to 10. */
  maxItems?: number
  /** Max file size in bytes, per photo. Defaults to 5 MB. */
  maxBytes?: number
  /** Additional accepted MIME types beyond the defaults (jpg, png, webp, svg, gif). */
  accept?: string
}
