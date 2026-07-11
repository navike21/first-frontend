import {
  PageContent,
  Select,
  InputField,
  Modal,
  Button,
  IconButton,
  IconComponent,
  Tooltip,
  FadeCollapse,
  Can,
  MediaGrid,
} from '@/shared/ui'
import { CAN, useHasPermission } from '@/shared/lib/permissions'
import { navPaths } from '@/shared/router'
import { MediaCard } from '../components/MediaCard'
import { MediaPreviewModal } from '../components/MediaPreviewModal'
import { MediaUploadModal } from '../components/MediaUploadModal'
import { formatFileSize } from '../model/formatFileSize'
import { useMediaPage } from './MediaPage.hooks'

export const MediaPage = () => {
  const {
    t,
    params,
    searchInput,
    setSearchInput,
    items,
    total,
    page,
    pages,
    isLoading,
    deletingItem,
    viewingItem,
    selectedIds,
    bulkConfirmOpen,
    uploadOpen,
    softDelete,
    kindOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleKindChange,
    handlePageChange,
    handleUploaded,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    setUploadOpen,
    clearSelection,
  } = useMediaPage()

  const canSeeTrash = useHasPermission(...CAN.mediaTrash)
  const canUpload = useHasPermission(...CAN.mediaUpload)
  const canDelete = useHasPermission(...CAN.mediaDelete)

  return (
    <PageContent
      title={t.page.listTitle}
      description={t.page.listDescription}
      actions={[
        ...(canSeeTrash
          ? [{ type: 'link' as const, label: t.actions.viewTrash, variant: 'outline' as const, to: navPaths.mediaTrash(), size: 'small' as const }]
          : []),
        ...(canUpload
          ? [{ type: 'button' as const, label: t.actions.uploadFiles, variant: 'primary' as const, size: 'small' as const, onClick: () => setUploadOpen(true) }]
          : []),
      ]}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-52">
          <Select
            label={t.filters.kindLabel}
            options={kindOptions}
            value={params.kind ?? 'all'}
            onChange={(e) => handleKindChange(e.target.value)}
          />
        </div>
        <div className="w-full flex-1">
          <InputField
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.filters.searchPlaceholder}
            leftSlot={<IconComponent icon="RiSearchLine" className="h-4 w-4 text-muted" />}
          />
        </div>
      </div>

      <div>
        {canDelete && (
          <FadeCollapse show={selectedIds.length > 0}>
            <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-2">
              <span className="text-sm font-medium text-foreground">
                {t.actions.selectedCount(selectedIds.length)}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="small" onClick={clearSelection}>
                  {t.actions.clearSelection}
                </Button>
                <Button variant="primary" size="small" onClick={() => setBulkConfirmOpen(true)}>
                  {t.actions.bulkDelete}
                </Button>
              </div>
            </div>
          </FadeCollapse>
        )}

        <MediaGrid
          items={items}
          getItemKey={(file) => file.id}
          isLoading={isLoading}
          emptyIcon="RiImage2Line"
          emptyLabel={t.grid.empty}
          totalLabel={t.grid.totalCount(total)}
          pagination={{ page, pages, onPageChange: handlePageChange, prevLabel: t.grid.prevPage, nextLabel: t.grid.nextPage }}
          selectable={canDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          selectAllLabel={t.grid.selectAllLabel}
          selectItemLabel={t.grid.selectItemLabel}
          renderItem={(file) => (
            <MediaCard
              file={file}
              caption={formatFileSize(file.size)}
              actions={
                <>
                  <Tooltip heading={t.actions.viewItem} position="top" size="small">
                    <IconButton icon="RiEyeLine" variant="text" size="small" aria-label={t.actions.viewItem} onClick={() => handleView(file)} />
                  </Tooltip>
                  <Can anyOf={CAN.mediaDelete}>
                    <Tooltip heading={t.actions.bulkDelete} position="top" size="small">
                      <IconButton icon="RiDeleteBinLine" variant="text" size="small" aria-label={t.actions.bulkDelete} onClick={() => handleDelete(file)} />
                    </Tooltip>
                  </Can>
                </>
              }
            />
          )}
        />
      </div>

      <MediaPreviewModal file={viewingItem} onClose={() => setViewingItem(null)} />

      <MediaUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />

      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={deletingItem ? t.actions.deleteDescription(deletingItem.originalName) : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingItem(null)} disabled={softDelete.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" loading={softDelete.isPending} onClick={handleConfirmDelete}>
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />

      <Modal
        isOpen={bulkConfirmOpen}
        onClose={() => setBulkConfirmOpen(false)}
        size="sm"
        title={t.actions.deleteTitle}
        description={t.actions.bulkDeleteDescription(selectedIds.length)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBulkConfirmOpen(false)} disabled={softDelete.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" loading={softDelete.isPending} onClick={handleConfirmBulkDelete}>
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
