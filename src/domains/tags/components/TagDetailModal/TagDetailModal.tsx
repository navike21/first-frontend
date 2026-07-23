import { Modal, Chip, DetailField } from '@/shared/ui'
import { useTagsTranslation } from '../../i18n'
import type { Tag } from '../../model/tag.types'

interface TagDetailModalProps {
  tag: Tag | null
  onClose: () => void
}

export const TagDetailModal = ({ tag, onClose }: TagDetailModalProps) => {
  const { t, language } = useTagsTranslation()

  return (
    <Modal isOpen={!!tag} onClose={onClose} size="lg" title={t.table.viewTag}>
      {tag && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">
                {tag.name[language] || tag.name.en}
              </span>
              <Chip
                size="x-small"
                variant={tag.isActive ? 'success' : 'default'}
              >
                {tag.isActive ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colSlug} value={tag.slug} />
            <DetailField label={t.form.order} value={String(tag.order)} />
          </div>
        </div>
      )}
    </Modal>
  )
}
