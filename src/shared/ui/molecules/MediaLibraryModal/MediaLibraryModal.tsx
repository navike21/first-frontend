import { useEffect, useState } from 'react'
import { useStorageFiles } from '@/shared/api/storage.queries'
import type { StorageFile } from '@/shared/api/storage'
import { IconComponent } from '../../atoms/IconComponent'
import { InputField } from '../InputField'
import { Modal } from '../Modal'
import { MediaGrid } from '../MediaGrid'
import type { MediaLibraryModalProps } from './MediaLibraryModal.types'

const PAGE_SIZE = 12
const SEARCH_DEBOUNCE_MS = 300

export const MediaLibraryModal = ({ isOpen, onClose, kind, onSelect, texts }: MediaLibraryModalProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

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

  const { data, isLoading } = useStorageFiles({ kind, search: search || undefined, page, limit: PAGE_SIZE })
  const items = data?.items ?? []
  const meta = data?.meta

  const handleSelect = (file: StorageFile) => {
    onSelect(file)
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

        <MediaGrid
          items={items}
          getItemKey={(file) => file.id}
          isLoading={isLoading}
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
              <div className="flex h-24 items-center justify-center overflow-hidden rounded-md bg-surface-subtle">
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
