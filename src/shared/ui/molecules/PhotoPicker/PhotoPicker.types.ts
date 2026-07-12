import type { StorageFile } from '@/shared/api/storage'
import type { MediaLibraryModalTexts } from '../MediaLibraryModal/MediaLibraryModal.types'

export interface PhotoPickerProps {
  currentUrl?: string
  uploadLabel: string
  formatsHint: string
  onChange: (file: File | null) => void
  /** When provided, a remove button is shown over the current/selected image. */
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
  /** Library-first UX: when passed, clicking the avatar opens the media
   * library first, with upload-a-new-file as the fallback inside that same
   * modal — instead of opening the native file picker directly. */
  onSelectLibrary?: (file: StorageFile) => void
  /** Required alongside `onSelectLibrary` — texts for the library modal. */
  libraryTexts?: MediaLibraryModalTexts
}
