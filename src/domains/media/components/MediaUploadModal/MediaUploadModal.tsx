import { useRef, useState } from 'react'
import clsx from 'clsx'
import { useQueryClient } from '@tanstack/react-query'
import { Modal, Button, IconButton, IconComponent, ProgressBar } from '@/shared/ui'
import { useUploadStorageImages, storageKeys } from '@/shared/api/storage.queries'
import { directUploadVideo, attachVideoCoverWithRetry } from '@/shared/api/storage'
import type { UploadProgress } from '@/shared/api/storage'
import { captureVideoFrame } from '@/shared/lib/captureVideoFrame'
import { notify } from '@/shared/lib/notify'
import { MAX_IMAGE_UPLOAD_BYTES } from '@/shared/lib'
import { useMediaTranslation } from '../../i18n'
import { formatFileSize } from '../../model/formatFileSize'

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4,video/webm'

// A direct-uploaded video's browser-side upload resolves before the backend's
// storage record actually exists — Vercel calls onUploadCompleted (which
// creates it) asynchronously, a couple seconds after the upload finishes. An
// immediate cache invalidation can race that and refetch too early, so a
// successful video upload schedules one more silent refetch after this delay.
const VIDEO_REGISTRATION_DELAY_MS = 3000

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
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const uploadImages = useUploadStorageImages()
  const hasUploadableFiles = queue.some((q) => !q.error)

  // Every file — image or video — is its own request, so each gets its own
  // progress value, keyed by file name.
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({})

  const rowProgress = (q: QueuedFile): number | undefined => {
    if (!uploading || q.error) return undefined
    return fileProgress[q.file.name]
  }

  const updateFileProgress = (fileName: string, percentage: number) => {
    setFileProgress((prev) => ({ ...prev, [fileName]: percentage }))
  }

  const renderRowStatus = (q: QueuedFile, progress: number | undefined) => {
    if (q.error) return <span className="shrink-0 text-xs text-danger-600">{q.error}</span>
    if (progress !== undefined) return <span className="shrink-0 text-xs text-muted">{progress}%</span>
    return <span className="shrink-0 text-xs text-muted">{formatFileSize(q.file.size)}</span>
  }

  const addFiles = (fileList: FileList) => {
    setQueue((prev) => [
      ...prev,
      ...Array.from(fileList).map((file) => ({
        file,
        // Checked client-side before the file ever reaches the network —
        // otherwise an oversized image silently queues with no hint of why
        // it'll fail, and only shows a reason once "Subir" is clicked.
        error:
          isImageFile(file) && file.size > MAX_IMAGE_UPLOAD_BYTES
            ? `Max ${Math.round(MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024)} MB`
            : undefined,
      })),
    ])
  }

  const removeFile = (index: number) => setQueue((prev) => prev.filter((_, i) => i !== index))

  const reset = () => {
    setQueue([])
    setIsDragging(false)
    setUploading(false)
    setFileProgress({})
  }

  const handleClose = () => {
    if (uploading) return
    reset()
    onClose()
  }

  const handleUpload = async () => {
    setUploading(true)
    setFileProgress({})
    // Files already flagged (e.g. oversized) never get sent — no point
    // attempting a request already known to fail.
    const validQueue = queue.filter((q) => !q.error)

    const uploadImageFile = (file: File) =>
      uploadImages.mutateAsync({
        files: [file],
        onProgress: (progress) => updateFileProgress(file.name, progress.percentage),
      })

    const uploadVideoWithCover = async (file: File) => {
      const id = crypto.randomUUID()
      const onProgress = (progress: UploadProgress) => updateFileProgress(file.name, progress.percentage)
      const result = await directUploadVideo(file, id, onProgress)
      captureVideoFrame(file).then((cover) => {
        if (cover) attachVideoCoverWithRetry(id, cover)
      })
      return result
    }

    // Every file goes out as its own request — this used to send all queued
    // images in one shared /storage/upload-bulk call, but a big enough batch
    // (e.g. 3 files just under the 4MB-each client limit) could still exceed
    // Vercel's platform body-size limit as a combined payload, failing with a
    // generic network error instead of a specific one. One request per file
    // keeps every payload under the already-validated per-file limit, and as
    // a side benefit gives each image its own progress, like video already had.
    const results = await Promise.allSettled(
      validQueue.map((q) => (isImageFile(q.file) ? uploadImageFile(q.file) : uploadVideoWithCover(q.file))),
    )

    // Maps each failed file name to the *specific* reason it failed (the
    // backend's own message when available) instead of one generic label.
    const failedMessages = new Map<string, string>()
    validQueue.forEach((q, i) => {
      const result = results[i]
      if (result.status === 'rejected') failedMessages.set(q.file.name, notify.errorMessage(result.reason))
    })

    const hasUploadedVideo = validQueue.some((q, i) => isVideoFile(q.file) && results[i].status === 'fulfilled')
    if (hasUploadedVideo) {
      setTimeout(() => qc.invalidateQueries({ queryKey: storageKeys.all }), VIDEO_REGISTRATION_DELAY_MS)
    }

    const hasRemainingErrors = queue.some((q) => q.error || failedMessages.has(q.file.name))
    if (!hasRemainingErrors) {
      reset()
      onUploaded()
      onClose()
      return
    }

    const succeededCount = validQueue.length - failedMessages.size
    setQueue((prev) =>
      prev
        .filter((q) => q.error || failedMessages.has(q.file.name))
        .map((q) => (failedMessages.has(q.file.name) ? { ...q, error: failedMessages.get(q.file.name) } : q)),
    )
    setUploading(false)
    if (succeededCount > 0) onUploaded()
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
          <Button variant="primary" loading={uploading} disabled={!hasUploadableFiles} onClick={handleUpload}>
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
            {queue.map((q, i) => {
              const progress = rowProgress(q)
              return (
                <li
                  key={`${q.file.name}-${i}`}
                  className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 flex-1 truncate">{q.file.name}</span>
                    {renderRowStatus(q, progress)}
                    <IconButton
                      icon="RiCloseLine"
                      variant="text"
                      size="small"
                      aria-label={t.actions.cancel}
                      disabled={uploading}
                      onClick={() => removeFile(i)}
                    />
                  </div>
                  {progress !== undefined && <ProgressBar value={progress} />}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Modal>
  )
}
