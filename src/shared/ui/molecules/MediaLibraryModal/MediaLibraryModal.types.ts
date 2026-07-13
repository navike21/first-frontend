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
  /** Footer button label in `multiple` mode — the selected count is appended, e.g. "Add (3)". */
  addSelectedLabel?: string
  /** "Select all" checkbox label — `multiple` mode only. */
  selectAllLabel?: string
  /** Per-item checkbox accessible label — `multiple` mode only. */
  selectItemLabel?: string
}

export interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  /** Locks the filter to one kind (no toggle shown) when the caller already
   * knows what it needs — e.g. opened from an image slot vs a video slot. */
  kind: 'image' | 'video'
  /** Single-select (default): picking a file selects it and closes the modal. */
  onSelect?: (file: StorageFile) => void
  /** Multi-select mode: tiles toggle a checkbox instead of selecting-and-closing;
   * a footer button confirms the batch via `onSelectMultiple`. */
  multiple?: boolean
  onSelectMultiple?: (files: StorageFile[]) => void
  /** Library-first UX: when passed, an "upload new" fallback is shown for the
   * case where the file isn't in the library yet. Receives the raw picked
   * file and closes the modal — the caller owns what happens with it. */
  onUploadNew?: (file: File) => void
  /** Accept string for the upload-new fallback input. Defaults per `kind`. */
  uploadAccept?: string
  texts: MediaLibraryModalTexts
}
