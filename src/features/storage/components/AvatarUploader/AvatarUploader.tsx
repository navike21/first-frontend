import { useRef, useState } from 'react'
import { Avatar, Spinner } from '@/shared/ui'
import { uploadFile } from '../../api/storage.api'

interface AvatarUploaderProps {
  entityId: string
  currentUrl?: string
  name?: string
  onUpload: (url: string) => void
  disabled?: boolean
}

const ACCEPTED = 'image/jpeg,image/png,image/webp'

export const AvatarUploader = ({
  entityId,
  currentUrl,
  name,
  onUpload,
  disabled,
}: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setIsUploading(true)
    try {
      const result = await uploadFile(file, 'user-profile', entityId)
      onUpload(result.full?.url ?? result.original.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        title="Cambiar foto"
      >
        <Avatar src={currentUrl} alt={name ?? 'avatar'} name={name} size="lg" />
        {isUploading ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Spinner size="small" />
          </span>
        ) : (
          <span className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white text-xs">
            ✎
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
