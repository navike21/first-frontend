import { useRef, useState, useEffect } from 'react'
import { IconComponent } from '@/shared/ui'

interface PhotoPickerProps {
  currentUrl?: string
  uploadLabel: string
  formatsHint: string
  onChange: (file: File | null) => void
  disabled?: boolean
}

const ACCEPTED = 'image/jpeg,image/png,image/webp'
const MAX_BYTES = 3 * 1024 * 1024

export const PhotoPicker = ({
  currentUrl,
  uploadLabel,
  formatsHint,
  onChange,
  disabled,
}: PhotoPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(currentUrl)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPreview(currentUrl)
  }, [currentUrl])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    if (file.size > MAX_BYTES) {
      setError('Max 3 MB')
      return
    }
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    onChange(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="group relative cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={uploadLabel}
      >
        <div
          className={`h-32 w-32 overflow-hidden rounded-full border-2 border-dashed transition-colors ${
            preview
              ? 'border-transparent'
              : 'border-slate-300 group-hover:border-blue-400'
          }`}
        >
          {preview ? (
            <img src={preview} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-100">
              <IconComponent
                icon="RiCameraLine"
                className="h-7 w-7 text-slate-400 transition-colors group-hover:text-blue-400"
              />
              <span className="px-2 text-center text-xs leading-tight text-slate-400 transition-colors group-hover:text-blue-400">
                {uploadLabel}
              </span>
            </div>
          )}
        </div>
        {preview && (
          <span className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white">
            <IconComponent icon="RiCameraLine" className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <p className="text-center text-xs leading-snug text-slate-500">{formatsHint}</p>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
