import type { StorageFile } from '@/shared/api/storage'

export interface MediaLibraryModalTexts {
  titleImage: string
  titleVideo: string
  searchPlaceholder: string
  empty: string
  selectLabel: string
  prevPage: string
  nextPage: string
}

export interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  /** Locks the filter to one kind (no toggle shown) when the caller already
   * knows what it needs — e.g. opened from an image slot vs a video slot. */
  kind: 'image' | 'video'
  onSelect: (file: StorageFile) => void
  texts: MediaLibraryModalTexts
}
