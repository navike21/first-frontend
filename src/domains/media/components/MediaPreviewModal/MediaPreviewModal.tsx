import { Modal, DetailField } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import type { StorageFile } from '@/shared/api/storage'
import { useMediaTranslation } from '../../i18n'
import { useUsersForMediaPicker } from '../../api/media.queries'
import { formatFileSize } from '../../model/formatFileSize'

export interface MediaPreviewModalProps {
  file: StorageFile | null
  onClose: () => void
}

export const MediaPreviewModal = ({ file, onClose }: MediaPreviewModalProps) => {
  const { t } = useMediaTranslation()
  const { data: usersData } = useUsersForMediaPicker()

  if (!file) return null

  const uploadedByName = () => {
    if (!file.uploadedBy) return t.preview.unknownUser
    const user = usersData?.find((u) => u.id === file.uploadedBy)
    return user ? `${user.firstName} ${user.lastName}` : t.preview.unknownUser
  }

  return (
    <Modal isOpen={!!file} onClose={onClose} size="lg" title={file.originalName}>
      <div className="-mx-6 -mt-5 mb-5 flex max-h-96 items-center justify-center overflow-hidden bg-surface-subtle">
        {file.isImage ? (
          <img
            src={file.full?.url ?? file.original.url}
            alt={file.originalName}
            className="max-h-96 w-full object-contain"
          />
        ) : (
          <video src={file.original.url} controls className="max-h-96 w-full" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <DetailField label={t.preview.type} value={file.mimeType} />
        <DetailField label={t.preview.size} value={formatFileSize(file.size)} />
        <DetailField label={t.preview.uploadedBy} value={uploadedByName()} />
        <DetailField label={t.preview.uploadedAt} value={formatDate(file.createdAt)} />
      </div>
    </Modal>
  )
}
