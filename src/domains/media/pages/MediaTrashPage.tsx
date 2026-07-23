import {
  PageContent,
  Select,
  InputField,
  IconButton,
  IconComponent,
  Tooltip,
  Modal,
  Button,
  ButtonGroup,
  FadeCollapse,
  Can,
  MediaGrid,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import { MediaCard } from '../components/MediaCard'
import { MediaPreviewModal } from '../components/MediaPreviewModal'
import { useMediaTrashPage } from './MediaTrashPage.hooks'

export const MediaTrashPage = () => {
  const {
    t,
    params,
    searchInput,
    setSearchInput,
    items,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    viewing,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    kindOptions,
    setViewing,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleKindChange,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  } = useMediaTrashPage()

  return (
    <PageContent
      title={t.page.trashTitle}
      description={t.page.trashDescription}
      actions={[
        {
          type: 'link',
          label: t.actions.cancel,
          variant: 'secondary',
          to: navPaths.media(),
          size: 'small',
        },
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
            leftSlot={
              <IconComponent
                icon="RiSearchLine"
                className="text-muted h-4 w-4"
              />
            }
          />
        </div>
      </div>

      <div>
        <FadeCollapse show={selectedIds.length > 0}>
          <div className="border-border bg-surface-subtle mb-6 flex items-center justify-between gap-3 rounded-lg border px-4 py-2">
            <span className="text-foreground text-sm font-medium">
              {t.actions.selectedCount(selectedIds.length)}
            </span>
            <ButtonGroup>
              <Button variant="secondary" size="small" onClick={clearSelection}>
                {t.actions.clearSelection}
              </Button>
              <Can anyOf={CAN.mediaTrash}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.mediaPurge}>
                <Button
                  variant="destructive"
                  size="small"
                  onClick={() => setBulkAction('purge')}
                >
                  {t.actions.bulkPurge}
                </Button>
              </Can>
            </ButtonGroup>
          </div>
        </FadeCollapse>

        <MediaGrid
          items={items}
          getItemKey={(file) => file.id}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon="RiDeleteBinLine"
          emptyLabel={t.page.trashEmpty}
          totalLabel={t.grid.totalCount(total)}
          pagination={{
            page,
            pages,
            onPageChange: handlePageChange,
            prevLabel: t.grid.prevPage,
            nextLabel: t.grid.nextPage,
          }}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          selectAllLabel={t.grid.selectAllLabel}
          selectItemLabel={t.grid.selectItemLabel}
          renderItem={(file) => (
            <MediaCard
              file={file}
              caption={`${t.grid.deletedAtLabel}: ${formatDate(file.deletedAt)}`}
              actions={
                <>
                  <Tooltip
                    heading={t.actions.viewItem}
                    position="top"
                    size="small"
                  >
                    <IconButton
                      icon="RiEyeLine"
                      variant="text"
                      size="small"
                      aria-label={t.actions.viewItem}
                      onClick={() => setViewing(file)}
                    />
                  </Tooltip>
                  <Can anyOf={CAN.mediaTrash}>
                    <Tooltip
                      heading={t.actions.bulkRestore}
                      position="top"
                      size="small"
                    >
                      <IconButton
                        icon="RiArrowGoBackLine"
                        variant="text"
                        size="small"
                        aria-label={t.actions.bulkRestore}
                        onClick={() => setRestoring(file)}
                      />
                    </Tooltip>
                  </Can>
                  <Can anyOf={CAN.mediaPurge}>
                    <Tooltip
                      heading={t.actions.bulkPurge}
                      position="top"
                      size="small"
                    >
                      <IconButton
                        icon="RiDeleteBin6Line"
                        variant="text"
                        size="small"
                        aria-label={t.actions.bulkPurge}
                        onClick={() => setPurging(file)}
                      />
                    </Tooltip>
                  </Can>
                </>
              }
            />
          )}
        />
      </div>

      <MediaPreviewModal file={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoring
            ? t.actions.restoreDescription(restoring.originalName)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRestoring(null)}
              disabled={restore.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={restore.isPending}
              onClick={handleConfirmRestore}
            >
              {t.actions.confirmRestore}
            </Button>
          </>
        }
      />

      <Modal
        isOpen={!!purging}
        onClose={() => setPurging(null)}
        size="sm"
        title={t.actions.purgeTitle}
        description={
          purging ? t.actions.purgeDescription(purging.originalName) : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPurging(null)}
              disabled={purge.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="destructive"
              loading={purge.isPending}
              onClick={handleConfirmPurge}
            >
              {t.actions.confirmPurge}
            </Button>
          </>
        }
      />

      <Modal
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        size="sm"
        title={
          bulkAction === 'restore'
            ? t.actions.restoreTitle
            : t.actions.purgeTitle
        }
        description={
          bulkAction === 'restore'
            ? t.actions.bulkRestoreDescription(selectedIds.length)
            : t.actions.bulkPurgeDescription(selectedIds.length)
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setBulkAction(null)}
              disabled={bulkRestore.isPending || bulkPurge.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant={bulkAction === 'restore' ? 'primary' : 'destructive'}
              loading={bulkRestore.isPending || bulkPurge.isPending}
              onClick={handleConfirmBulk}
            >
              {bulkAction === 'restore'
                ? t.actions.confirmRestore
                : t.actions.confirmPurge}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
