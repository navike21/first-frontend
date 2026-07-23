import {
  PageContent,
  DataTable,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Modal,
  FadeCollapse,
  Can,
  Chip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import { usePagesTrashPage } from './PagesTrashPage.hooks'
import { PageDetailModal } from '../components/PageDetailModal/PageDetailModal'
import type { Page, PageStatus } from '../model/page.types'

const STATUS_VARIANT: Record<
  PageStatus,
  'success' | 'warning' | 'informative'
> = {
  published: 'success',
  scheduled: 'informative',
  draft: 'warning',
}

export const PagesTrashPage = () => {
  const {
    t,
    language,
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
    setViewing,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  } = usePagesTrashPage()

  const columns: DataTableColumn<Page>[] = [
    {
      id: 'title',
      header: t.table.colTitle,
      cell: (item) => (
        <span className="text-foreground font-medium">
          {item.title[language] || item.title.en}
        </span>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (item) => (
        <Chip size="small" variant={STATUS_VARIANT[item.status]}>
          {t.status[item.status]}
        </Chip>
      ),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (item) => (item.deletedAt ? formatDate(item.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewItem} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewItem}
              onClick={() => setViewing(item)}
            />
          </Tooltip>
          <Can anyOf={CAN.pagesUpdate}>
            <Tooltip heading={t.table.restoreItem} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreItem}
                onClick={() => setRestoring(item)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.pagesPurge}>
            <Tooltip heading={t.table.purgeItem} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeItem}
                onClick={() => setPurging(item)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ]

  return (
    <PageContent
      title={t.page.trashTitle}
      description={t.page.trashDescription}
      actions={[
        {
          type: 'link',
          label: t.actions.cancel,
          variant: 'secondary',
          to: navPaths.pages(language),
          size: 'small',
        },
      ]}
    >
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
              <Can anyOf={CAN.pagesUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.pagesPurge}>
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

        <DataTable
          columns={columns}
          rows={items}
          getRowKey={(item) => item.id}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon="RiDeleteBinLine"
          emptyLabel={t.page.trashEmpty}
          totalLabel={t.table.totalCount(total)}
          pagination={{
            page,
            pages,
            onPageChange: handlePageChange,
            prevLabel: t.table.prevPage,
            nextLabel: t.table.nextPage,
          }}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          selectAllLabel={t.table.selectAll}
          selectRowLabel={t.table.selectRow}
        />
      </div>

      <PageDetailModal item={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoring
            ? t.actions.restoreDescription(
                restoring.title[language] || restoring.title.en
              )
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
          purging
            ? t.actions.purgeDescription(
                purging.title[language] || purging.title.en
              )
            : undefined
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
