import { useRef, useState, useEffect } from 'react'

const MAX_BYTES = 3 * 1024 * 1024

interface UsePhotoPickerProps {
  currentUrl?: string
  onChange: (file: File | null) => void
  onRemove?: () => void
}

export function usePhotoPicker({
  currentUrl,
  onChange,
  onRemove,
}: UsePhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(currentUrl)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPreview(currentUrl)
  }, [currentUrl])

  const handleFile = (file: File) => {
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  const openPicker = () => inputRef.current?.click()

  const handleRemove = () => {
    setError(null)
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return undefined
    })
    onChange(null)
    onRemove?.()
  }

  return { inputRef, preview, error, handleChange, handleFile, openPicker, handleRemove }
}
