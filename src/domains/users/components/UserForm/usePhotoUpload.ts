import { useState } from 'react'
import type { StorageFile } from '@/shared/api/storage'

/**
 * Holds the avatar File the user picked. The backend now owns the upload:
 * the File is sent as the `avatar` part of the create/update multipart request
 * (see `users.api.ts`), so there's no upfront upload here anymore.
 *
 * Also holds an already-hosted URL picked from the media library — mutually
 * exclusive with `pendingFile` (picking one clears the other).
 */
export function usePhotoUpload() {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [libraryUrl, setLibraryUrl] = useState<string | null>(null)

  const onPickFile = (file: File | null) => {
    setPendingFile(file)
    if (file) setLibraryUrl(null)
  }

  const onSelectLibrary = (file: StorageFile) => {
    setLibraryUrl(file.original.url)
    setPendingFile(null)
  }

  return { pendingFile, setPendingFile, libraryUrl, setLibraryUrl, onPickFile, onSelectLibrary }
}
