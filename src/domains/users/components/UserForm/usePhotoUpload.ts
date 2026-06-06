import { useState } from 'react'
import { uploadFile } from '@/shared/api'

export function usePhotoUpload() {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadIfNeeded = async (entityId: string): Promise<string | undefined> => {
    if (!pendingFile) return undefined
    setIsUploading(true)
    try {
      const result = await uploadFile(pendingFile, 'user-profile', entityId)
      return result.full?.url ?? result.original.url
    } finally {
      setIsUploading(false)
    }
  }

  return { setPendingFile, isUploading, uploadIfNeeded }
}
