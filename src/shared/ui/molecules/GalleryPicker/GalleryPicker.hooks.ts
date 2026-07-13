import { useRef, useState, useCallback, useEffect } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { StorageFile } from '@/shared/api/storage'
import type { GalleryItem } from './GalleryPicker.types'

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024
const DEFAULT_MAX_ITEMS = 10

interface UseGalleryPickerProps {
  items: GalleryItem[]
  onItemsChange: (items: GalleryItem[]) => void
  maxItems?: number
  maxBytes?: number
}

export function useGalleryPicker({
  items,
  onItemsChange,
  maxItems = DEFAULT_MAX_ITEMS,
  maxBytes = DEFAULT_MAX_BYTES,
}: UseGalleryPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Always revoke any outstanding blob previews when the picker unmounts
  // (e.g. the user cancels/navigates away without submitting).
  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])
  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.kind === 'new') URL.revokeObjectURL(item.url)
      }
    }
  }, [])

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null)
      const remaining = maxItems - items.length
      if (remaining <= 0) return

      const fileArray = Array.from(files).slice(0, remaining)
      const accepted: GalleryItem[] = []
      for (const file of fileArray) {
        if (file.size > maxBytes) {
          setError(`Max ${Math.round(maxBytes / 1024 / 1024)} MB`)
          continue
        }
        accepted.push({
          key: crypto.randomUUID(),
          kind: 'new',
          url: URL.createObjectURL(file),
          file,
        })
      }
      if (accepted.length) onItemsChange([...items, ...accepted])
    },
    [items, maxItems, maxBytes, onItemsChange],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
    if (inputRef.current) inputRef.current.value = ''
  }

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
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const openPicker = () => inputRef.current?.click()

  const addLibraryFiles = (files: StorageFile[]) => {
    const remaining = maxItems - items.length
    if (remaining <= 0) return
    const accepted: GalleryItem[] = files
      .slice(0, remaining)
      .map((file) => ({ key: file.id, kind: 'existing', url: file.original.url }))
    if (accepted.length) onItemsChange([...items, ...accepted])
  }

  const removeItem = (key: string) => {
    const target = items.find((item) => item.key === key)
    if (target?.kind === 'new') URL.revokeObjectURL(target.url)
    onItemsChange(items.filter((item) => item.key !== key))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((item) => item.key === active.id)
    const newIndex = items.findIndex((item) => item.key === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onItemsChange(arrayMove(items, oldIndex, newIndex))
  }

  return {
    inputRef,
    error,
    isDragging,
    atMax: items.length >= maxItems,
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openPicker,
    addFiles,
    addLibraryFiles,
    removeItem,
    handleDragEnd,
  }
}
