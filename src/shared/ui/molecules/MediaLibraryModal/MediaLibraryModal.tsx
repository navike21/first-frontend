import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useStorageFiles } from '@/shared/api/storage.queries'
import type { StorageFile } from '@/shared/api/storage'
import { IconComponent } from '../../atoms/IconComponent'
import { IconButton } from '../../atoms/IconButton'
import { Spinner } from '../../atoms/Spinner'
import { InputField } from '../InputField'
import { Modal } from '../Modal'
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

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner variant="gradient" size="medium" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">{texts.empty}</p>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => handleSelect(file)}
                aria-label={`${texts.selectLabel}: ${file.originalName}`}
                className="group flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-2 text-left transition-colors hover:border-primary-600"
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
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <IconButton
              icon="RiArrowLeftSLine"
              variant="text"
              size="small"
              aria-label={texts.prevPage}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
            <span className={clsx('text-xs text-muted')}>
              {meta.page} / {meta.totalPages}
            </span>
            <IconButton
              icon="RiArrowRightSLine"
              variant="text"
              size="small"
              aria-label={texts.nextPage}
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
