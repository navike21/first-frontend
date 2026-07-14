import { useRef, useState, useCallback } from 'react'

const DEFAULT_MAX = 5 * 1024 * 1024

interface UseCoverPickerProps {
  currentUrl?: string
  onChange: (file: File | null) => void
  onRemove?: () => void
  maxBytes?: number
  accept?: string
}

export function useCoverPicker({
  currentUrl,
  onChange,
  onRemove,
  maxBytes = DEFAULT_MAX,
}: UseCoverPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Adjust state during render (React's recommended alternative to an effect
  // for "reset internal state when a prop changes") — avoids the extra
  // effect-triggered render pass.
  const [prevUrl, setPrevUrl] = useState(currentUrl)
  if (currentUrl !== prevUrl) {
    setPrevUrl(currentUrl)
    setPreview(currentUrl)
  }

  const processFile = useCallback(
    (file: File) => {
      setError(null)
      if (file.size > maxBytes) {
        setError(`Max ${Math.round(maxBytes / 1024 / 1024)} MB`)
        return
      }
      setPreview((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return URL.createObjectURL(file)
      })
      onChange(file)
    },
    [maxBytes, onChange]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  // Exposed so a library-first flow (MediaLibraryModal's upload-new fallback)
  // can hand a picked File straight in, without a synthetic change event.
  const handleFile = processFile

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processFile(file)
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
    if (inputRef.current) inputRef.current.value = ''
  }

  return {
    inputRef,
    preview,
    error,
    isDragging,
    handleChange,
    handleFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openPicker,
    handleRemove,
  }
}
