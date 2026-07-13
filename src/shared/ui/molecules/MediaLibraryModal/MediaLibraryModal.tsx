import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useStorageFiles } from '@/shared/api/storage.queries'
import type { StorageFile } from '@/shared/api/storage'
import { Button } from '../../atoms/Button'
import { IconComponent } from '../../atoms/IconComponent'
import { MediaThumbnail } from '../../atoms/MediaThumbnail'
import { InputField } from '../InputField'
import { Modal } from '../Modal'
import { MediaGrid } from '../MediaGrid'
import type { MediaLibraryModalProps } from './MediaLibraryModal.types'

const PAGE_SIZE = 12
const SEARCH_DEBOUNCE_MS = 300
const DEFAULT_UPLOAD_ACCEPT: Record<'image' | 'video', string> = {
  image: 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif',
  video: 'video/mp4,video/webm',
}

export const MediaLibraryModal = ({
  isOpen,
  onClose,
  kind,
  onSelect,
  multiple = false,
  onSelectMultiple,
  onUploadNew,
  uploadAccept,
  texts,
}: MediaLibraryModalProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // Selected files accumulate across pages/searches (keyed by id) so confirming
  // a multi-page selection doesn't lose files no longer in the current `items`.
  const [selectedFiles, setSelectedFiles] = useState<Map<string, StorageFile>>(new Map())
  const uploadInputRef = useRef<HTMLInputElement>(null)

  // Reset when transitioning closed→open (not via an effect: adjusting state
  // during render in response to a prop change is React's documented pattern
  // for this — a bounded re-render, not a cascading effect).
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) {
      setSearchInput('')
      setSearch('')
      setPage(1)
      setSelectedIds([])
      setSelectedFiles(new Map())
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isFetching } = useStorageFiles({ kind, search: search || undefined, page, limit: PAGE_SIZE })
  const items = data?.items ?? []
  const meta = data?.meta

  const handleSelect = (file: StorageFile) => {
    onSelect?.(file)
    onClose()
  }

  const toggleSelected = (file: StorageFile) => {
    setSelectedIds((ids) => (ids.includes(file.id) ? ids.filter((id) => id !== file.id) : [...ids, file.id]))
    setSelectedFiles((prev) => {
      const next = new Map(prev)
      if (next.has(file.id)) next.delete(file.id)
      else next.set(file.id, file)
      return next
    })
  }

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids)
    setSelectedFiles((prev) => {
      const next = new Map(prev)
      for (const id of prev.keys()) if (!ids.includes(id)) next.delete(id)
      for (const id of ids) {
        if (!next.has(id)) {
          const file = items.find((f) => f.id === id)
          if (file) next.set(id, file)
        }
      }
      return next
    })
  }

  const handleConfirmMultiple = () => {
    onSelectMultiple?.(Array.from(selectedFiles.values()))
    onClose()
  }

  const handleUploadNew = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !onUploadNew) return
    onUploadNew(file)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={kind === 'image' ? texts.titleImage : texts.titleVideo}
      footer={
        multiple ? (
          <Button variant="primary" disabled={selectedIds.length === 0} onClick={handleConfirmMultiple}>
            {texts.addSelectedLabel} ({selectedIds.length})
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        <InputField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={texts.searchPlaceholder}
          leftSlot={<IconComponent icon="RiSearchLine" className="h-4 w-4 text-muted" />}
        />

        {onUploadNew && (
          <>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-subtle px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:border-primary-600/60 hover:text-primary-600"
            >
              <IconComponent icon="RiUploadCloud2Line" className="h-4 w-4" />
              {texts.uploadNewLabel}
            </button>
            {texts.uploadNewHint && <p className="-mt-2 text-center text-xs text-muted">{texts.uploadNewHint}</p>}
            <input
              ref={uploadInputRef}
              type="file"
              accept={uploadAccept ?? DEFAULT_UPLOAD_ACCEPT[kind]}
              className="hidden"
              onChange={handleUploadNew}
            />
          </>
        )}

        <MediaGrid
          items={items}
          getItemKey={(file) => file.id}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={kind === 'video' ? 'RiVideoLine' : 'RiImage2Line'}
          emptyLabel={texts.empty}
          pagination={
            meta && meta.totalPages > 1
              ? { page, pages: meta.totalPages, onPageChange: setPage, prevLabel: texts.prevPage, nextLabel: texts.nextPage }
              : undefined
          }
          selectable={multiple}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          selectAllLabel={texts.selectAllLabel}
          selectItemLabel={texts.selectItemLabel}
          renderItem={(file) => (
            <button
              type="button"
              onClick={() => (multiple ? toggleSelected(file) : handleSelect(file))}
              aria-label={`${texts.selectLabel}: ${file.originalName}`}
              className="group flex w-full flex-col gap-1.5 rounded-lg border border-border bg-surface p-2 text-left transition-colors hover:border-primary-600"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-surface-subtle">
                <MediaThumbnail
                  src={file.isImage ? (file.thumb?.url ?? file.full?.url ?? file.original.url) : file.original.url}
                  kind={file.isImage ? 'image' : 'video'}
                  alt={file.originalName}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="truncate text-[11px] text-muted">{file.originalName}</span>
            </button>
          )}
        />
      </div>
    </Modal>
  )
}
