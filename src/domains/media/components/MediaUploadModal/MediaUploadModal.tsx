import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Modal, Button, IconButton, IconComponent } from '@/shared/ui'
import { useUploadStorageImages } from '@/shared/api/storage.queries'
import { directUploadVideo } from '@/shared/api/storage'
import { useMediaTranslation } from '../../i18n'
import { formatFileSize } from '../../model/formatFileSize'

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4,video/webm'

export interface MediaUploadModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called once at least one file uploaded successfully — caller invalidates/refetches its own list. */
  onUploaded: () => void
}

interface QueuedFile {
  file: File
  error?: string
}

const isVideoFile = (file: File) => file.type.startsWith('video/')
const isImageFile = (file: File) => file.type.startsWith('image/')

export const MediaUploadModal = ({ isOpen, onClose, onUploaded }: MediaUploadModalProps) => {
  const { t } = useMediaTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const uploadImages = useUploadStorageImages()

  const addFiles = (fileList: FileList) => {
    setQueue((prev) => [...prev, ...Array.from(fileList).map((file) => ({ file }))])
  }

  const removeFile = (index: number) => setQueue((prev) => prev.filter((_, i) => i !== index))

  const reset = () => {
    setQueue([])
    setIsDragging(false)
    setUploading(false)
  }

  const handleClose = () => {
    if (uploading) return
    reset()
    onClose()
  }

  const handleUpload = async () => {
    setUploading(true)
    const images = queue.filter((q) => isImageFile(q.file))
    const videos = queue.filter((q) => isVideoFile(q.file))

    const [imagesResult, ...videoResults] = await Promise.allSettled([
      images.length > 0 ? uploadImages.mutateAsync(images.map((q) => q.file)) : Promise.resolve([]),
      ...videos.map((q) => directUploadVideo(q.file)),
    ])

    const failedNames = new Set<string>()
    if (images.length > 0 && imagesResult.status === 'rejected') {
      images.forEach((q) => failedNames.add(q.file.name))
    }
    videos.forEach((q, i) => {
      if (videoResults[i]?.status === 'rejected') failedNames.add(q.file.name)
    })

    if (failedNames.size === 0) {
      reset()
      onUploaded()
      onClose()
      return
    }

    const hadSuccess = failedNames.size < queue.length
    setQueue((prev) =>
      prev
        .filter((q) => failedNames.has(q.file.name))
        .map((q) => ({ ...q, error: t.upload.errorLabel })),
    )
    setUploading(false)
    if (hadSuccess) onUploaded()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title={t.upload.title}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={uploading}>
            {t.actions.cancel}
          </Button>
          <Button variant="primary" loading={uploading} disabled={queue.length === 0} onClick={handleUpload}>
            {uploading ? t.upload.uploadingLabel : t.upload.uploadButton}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          className={clsx(
            'flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
            isDragging ? 'border-primary-600 bg-primary-700/5' : 'border-border bg-surface-subtle hover:border-primary-600/60',
          )}
        >
          <IconComponent
            icon={isDragging ? 'RiDownloadLine' : 'RiUploadCloud2Line'}
            className={clsx('h-7 w-7', isDragging ? 'text-primary-600' : 'text-muted')}
          />
          <p className="text-sm font-semibold text-foreground">{t.upload.dragLabel}</p>
          <p className="text-sm text-secondary">
            {t.upload.dragOrLabel}{' '}
            <span className="font-medium text-primary-600 underline underline-offset-2">{t.upload.browseLabel}</span>
          </p>
          <p className="text-xs text-muted">{t.upload.formatsHint}</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
        />

        {queue.length > 0 && (
          <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {queue.map((q, i) => (
              <li
                key={`${q.file.name}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <span className="min-w-0 flex-1 truncate">{q.file.name}</span>
                {q.error ? (
                  <span className="shrink-0 text-xs text-red-500">{q.error}</span>
                ) : (
                  <span className="shrink-0 text-xs text-muted">{formatFileSize(q.file.size)}</span>
                )}
                <IconButton
                  icon="RiCloseLine"
                  variant="text"
                  size="small"
                  aria-label={t.actions.cancel}
                  disabled={uploading}
                  onClick={() => removeFile(i)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}
