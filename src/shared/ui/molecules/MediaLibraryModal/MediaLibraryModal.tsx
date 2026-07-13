import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useStorageFiles } from '@/shared/api/storage.queries'
import type { StorageFile } from '@/shared/api/storage'
import { Button } from '../../atoms/Button'
import { IconButton } from '../../atoms/IconButton'
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
  // Video-only: an in-place preview overlay (inside this same modal, not a
  // stacked one) so picking a video doesn't mean guessing from a thumbnail.
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null)
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
      setPreviewFile(null)
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

  const isPreviewSelected = previewFile ? selectedIds.includes(previewFile.id) : false
  let previewActionLabel: string | undefined = texts.selectLabel
  if (multiple) previewActionLabel = isPreviewSelected ? texts.removeFromSelectionLabel : texts.addToSelectionLabel

  const handlePreviewAction = () => {
    if (!previewFile) return
    if (multiple) {
      toggleSelected(previewFile)
      setPreviewFile(null)
    } else {
      handleSelect(previewFile)
    }
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
      <div className="relative flex flex-col gap-4">
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
            <div
              role="button"
              tabIndex={0}
              onClick={() => (multiple ? toggleSelected(file) : handleSelect(file))}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                if (multiple) toggleSelected(file)
                else handleSelect(file)
              }}
              aria-label={`${texts.selectLabel}: ${file.originalName}`}
              className="group flex w-full cursor-pointer flex-col gap-1.5 rounded-lg border border-border bg-surface p-2 text-left transition-colors hover:border-primary-600"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-surface-subtle">
                <MediaThumbnail
                  src={file.isImage ? (file.thumb?.url ?? file.full?.url ?? file.original.url) : file.original.url}
                  kind={file.isImage ? 'image' : 'video'}
                  posterSrc={file.isImage ? undefined : (file.thumb?.url ?? file.full?.url)}
                  entityId={file.id}
                  alt={file.originalName}
                  className="h-full w-full object-cover"
                />
                {!file.isImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewFile(file)
                    }}
                    aria-label={`${texts.previewLabel}: ${file.originalName}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <IconComponent icon="RiPlayCircleLine" className="h-8 w-8 drop-shadow" />
                  </button>
                )}
              </div>
              <span className="truncate text-[11px] text-muted">{file.originalName}</span>
            </div>
          )}
        />

        {previewFile && (
          <div
            role="presentation"
            onClick={() => setPreviewFile(null)}
            // `inset-x-0 top-0` (no `bottom`) instead of `inset-0`: this box's
            // sibling (the grid) can be shorter than the video+button content
            // below, and `inset-0` would size to that shorter box, leaving
            // the confirm button to overflow past it and render underneath
            // the modal's fixed footer — unclickable (confirmed live).
            // Height auto-sizing to content keeps it properly in the
            // scrollable flow instead.
            className="absolute inset-x-0 top-0 z-10 flex min-h-full flex-col items-center justify-center gap-3 rounded-lg bg-surface/95 p-4 backdrop-blur-sm"
          >
            <div
              role="presentation"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-full flex-col items-center gap-3"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-foreground">{previewFile.originalName}</span>
                <IconButton
                  icon="RiCloseLine"
                  variant="text"
                  size="small"
                  aria-label={texts.closePreviewLabel}
                  onClick={() => setPreviewFile(null)}
                />
              </div>
              <video
                src={previewFile.original.url}
                controls
                autoPlay
                className="max-h-[50vh] w-full rounded-md bg-black object-contain"
              />
              <Button variant="primary" onClick={handlePreviewAction}>
                {previewActionLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
