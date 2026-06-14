import { useState } from 'react'

/**
 * Holds the avatar File the user picked. The backend now owns the upload:
 * the File is sent as the `avatar` part of the create/update multipart request
 * (see `users.api.ts`), so there's no upfront upload here anymore.
 */
export function usePhotoUpload() {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  return { pendingFile, setPendingFile }
}
