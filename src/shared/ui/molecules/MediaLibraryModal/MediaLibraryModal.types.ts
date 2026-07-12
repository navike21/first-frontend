import type { StorageFile } from '@/shared/api/storage'

export interface MediaLibraryModalTexts {
  titleImage: string
  titleVideo: string
  searchPlaceholder: string
  empty: string
  selectLabel: string
  prevPage: string
  nextPage: string
  /** Label for the "upload new" fallback action. Only shown when `onUploadNew` is passed. */
  uploadNewLabel?: string
  /** Short hint under the upload-new action (e.g. accepted formats). */
  uploadNewHint?: string
}

export interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  /** Locks the filter to one kind (no toggle shown) when the caller already
   * knows what it needs — e.g. opened from an image slot vs a video slot. */
  kind: 'image' | 'video'
  onSelect: (file: StorageFile) => void
  /** Library-first UX: when passed, an "upload new" fallback is shown for the
   * case where the file isn't in the library yet. Receives the raw picked
   * file and closes the modal — the caller owns what happens with it. */
  onUploadNew?: (file: File) => void
  /** Accept string for the upload-new fallback input. Defaults per `kind`. */
  uploadAccept?: string
  texts: MediaLibraryModalTexts
}
