import { useRef, useState, useEffect } from 'react'

const MAX_BYTES = 3 * 1024 * 1024

interface UsePhotoPickerProps {
  currentUrl?: string
  onChange: (file: File | null) => void
}

export function usePhotoPicker({ currentUrl, onChange }: UsePhotoPickerProps) {
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

  const openPicker = () => inputRef.current?.click()

  return { inputRef, preview, error, handleChange, openPicker }
}
