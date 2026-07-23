import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Modal, DetailField, Tabs, Spinner, IconComponent } from '@/shared/ui'
import type { TabItem } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import type {
  StorageFile,
  StorageFileUsage,
  StorageUsageModule,
  StorageUsageContext,
} from '@/shared/api/storage'
import { useStorageFileUsages } from '@/shared/api/storage.queries'
import { useMediaTranslation } from '../../i18n'
import { useUsersForMediaPicker } from '../../api/media.queries'
import { formatFileSize } from '../../model/formatFileSize'

export interface MediaPreviewModalProps {
  file: StorageFile | null
  onClose: () => void
}

type PreviewTab = 'details' | 'usage'

export const MediaPreviewModal = ({
  file,
  onClose,
}: MediaPreviewModalProps) => {
  const { t } = useMediaTranslation()
  const { data: usersData } = useUsersForMediaPicker()
  const [activeTab, setActiveTab] = useState<PreviewTab>('details')

  // Reset to the first tab when a different file opens (this component stays
  // mounted across open/close — same "adjust state during render" pattern as
  // MediaLibraryModal, not an effect).
  const [lastFileId, setLastFileId] = useState<string | null>(null)
  if ((file?.id ?? null) !== lastFileId) {
    setLastFileId(file?.id ?? null)
    if (file) setActiveTab('details')
  }

  const { data: usages, isLoading: usagesLoading } = useStorageFileUsages(
    file?.id ?? '',
    activeTab === 'usage' && !!file
  )

  if (!file) return null

  const uploadedByName = () => {
    if (!file.uploadedBy) return t.preview.unknownUser
    const user = usersData?.find((u) => u.id === file.uploadedBy)
    return user ? `${user.firstName} ${user.lastName}` : t.preview.unknownUser
  }

  const moduleLabels: Record<StorageUsageModule, string> = {
    clients: t.preview.moduleClients,
    users: t.preview.moduleUsers,
    collaborators: t.preview.moduleCollaborators,
    portfolio: t.preview.modulePortfolio,
    services: t.preview.moduleServices,
    pages: t.preview.modulePages,
    'app-settings': t.preview.moduleAppSettings,
  }

  const contextLabels: Record<StorageUsageContext, string> = {
    cover: t.preview.contextCover,
    gallery: t.preview.contextGallery,
    ogImage: t.preview.contextOgImage,
    background: t.preview.contextBackground,
    logo: t.preview.contextLogo,
    favicon: t.preview.contextFavicon,
  }

  const usageLink = (usage: StorageFileUsage): string | undefined => {
    switch (usage.module) {
      case 'clients':
        return navPaths.clientEdit(usage.id)
      case 'users':
        return navPaths.userEdit(usage.id)
      case 'collaborators':
        return navPaths.collaboratorEdit(usage.id)
      case 'portfolio':
        return navPaths.portfolioEdit(usage.id)
      case 'services':
        return navPaths.serviceEdit(usage.id)
      case 'pages':
        return navPaths.pageEdit(usage.id)
      case 'app-settings':
        return navPaths.appSettings()
      default:
        return undefined
    }
  }

  const tabs: TabItem[] = [
    { id: 'details', label: t.preview.tabDetails },
    { id: 'usage', label: t.preview.tabUsage },
  ]

  return (
    <Modal
      isOpen={!!file}
      onClose={onClose}
      size="lg"
      title={file.originalName}
    >
      <div className="bg-surface-subtle -mx-6 -mt-5 mb-5 flex max-h-96 items-center justify-center overflow-hidden">
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

      <Tabs
        tabs={tabs}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as PreviewTab)}
        instanceId="media-preview"
        ariaLabel={file.originalName}
      />

      {activeTab === 'details' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DetailField label={t.preview.type} value={file.mimeType} />
          <DetailField
            label={t.preview.size}
            value={formatFileSize(file.size)}
          />
          <DetailField label={t.preview.uploadedBy} value={uploadedByName()} />
          <DetailField
            label={t.preview.uploadedAt}
            value={formatDate(file.createdAt)}
          />
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="mt-4 flex flex-col gap-3">
          {usagesLoading && (
            <div className="text-muted flex items-center justify-center gap-2 py-8 text-sm">
              <Spinner size="small" />
              {t.preview.usageLoading}
            </div>
          )}

          {!usagesLoading && (!usages || usages.length === 0) && (
            <div className="text-muted flex flex-col items-center justify-center gap-2 py-8 text-center">
              <IconComponent icon="RiShieldCheckLine" className="h-8 w-8" />
              <p className="text-sm">{t.preview.usageEmpty}</p>
            </div>
          )}

          {!usagesLoading && usages && usages.length > 0 && (
            <ul className="flex flex-col gap-2">
              {usages.map((usage) => {
                const link = usageLink(usage)
                return (
                  <li
                    key={`${usage.module}-${usage.id}-${usage.context ?? ''}`}
                    className="border-border bg-surface flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 truncate">
                      <span className="text-foreground font-medium">
                        {moduleLabels[usage.module]}
                      </span>
                      {usage.label && (
                        <span className="text-muted"> — {usage.label}</span>
                      )}
                      {usage.context && (
                        <span className="text-muted text-xs">
                          {' '}
                          ({contextLabels[usage.context]})
                        </span>
                      )}
                    </div>
                    {link && (
                      <Link
                        to={link}
                        className="text-primary-600 shrink-0 text-xs font-medium underline underline-offset-2"
                      >
                        {t.actions.viewItem}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          <p className="text-muted text-xs">{t.preview.usageEditorNote}</p>
        </div>
      )}
    </Modal>
  )
}
