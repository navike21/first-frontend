export interface PhotoPickerProps {
  currentUrl?: string
  uploadLabel: string
  formatsHint: string
  onChange: (file: File | null) => void
  /** When provided, a remove button is shown over the current/selected image. */
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
}
