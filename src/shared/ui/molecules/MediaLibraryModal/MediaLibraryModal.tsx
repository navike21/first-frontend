import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useStorageFiles } from '@/shared/api/storage.queries'
import type { StorageFile } from '@/shared/api/storage'
import { IconComponent } from '../../atoms/IconComponent'
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
  onUploadNew,
  uploadAccept,
  texts,
}: MediaLibraryModalProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
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
    onSelect(file)
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={kind === 'image' ? texts.titleImage : texts.titleVideo}>
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
          renderItem={(file) => (
            <button
              type="button"
              onClick={() => handleSelect(file)}
              aria-label={`${texts.selectLabel}: ${file.originalName}`}
              className="group flex w-full flex-col gap-1.5 rounded-lg border border-border bg-surface p-2 text-left transition-colors hover:border-primary-600"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-surface-subtle">
                {file.isImage ? (
                  <img
                    src={file.thumb?.url ?? file.full?.url ?? file.original.url}
                    alt={file.originalName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IconComponent icon="RiVideoLine" className="h-8 w-8 text-muted" />
                )}
              </div>
              <span className="truncate text-[11px] text-muted">{file.originalName}</span>
            </button>
          )}
        />
      </div>
    </Modal>
  )
}
