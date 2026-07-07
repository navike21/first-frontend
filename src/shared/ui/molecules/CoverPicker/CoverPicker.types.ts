export interface CoverPickerProps {
  currentUrl?: string
  uploadLabel?: string
  dragLabel?: string
  /** The "or" connector text in "Drag here or {browseLabel}". Pass a translated string. */
  dragOrLabel?: string
  browseLabel?: string
  formatsHint?: string
  /** External validation error (e.g. from react-hook-form). Shown inside the drop zone. */
  errorMessage?: string
  onChange: (file: File | null) => void
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
  /** Max file size in bytes. Defaults to 5 MB. */
  maxBytes?: number
  /** Additional accepted MIME types beyond the defaults (jpg, png, webp, svg, gif). */
  accept?: string
  /** 'compact' reduces the height and padding for small icon pickers. Default: 'default'. */
  variant?: 'default' | 'compact'
}
