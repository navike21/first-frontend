import {
  PageContent,
  DataTable,
  Button,
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
import { useTagsTrashPage } from './TagsTrashPage.hooks'
import { TagDetailModal } from '../components/TagDetailModal/TagDetailModal'
import type { Tag } from '../model/tag.types'

export const TagsTrashPage = () => {
  const {
    t,
    language,
    tags,
    total,
    pages,
    page,
    isLoading,
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
  } = useTagsTrashPage()

  const columns: DataTableColumn<Tag>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (tag) => <span className="font-medium text-foreground">{tag.name[language] || tag.name.en}</span>,
    },
    {
      id: 'slug',
      header: t.table.colSlug,
      cellClassName: 'text-secondary',
      cell: (tag) => tag.slug,
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (tag) => (
        <Chip size="small" variant={tag.isActive ? 'success' : 'default'}>
          {tag.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (tag) => (tag.deletedAt ? formatDate(tag.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (tag) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewTag} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewTag}
              onClick={() => setViewing(tag)}
            />
          </Tooltip>
          <Can anyOf={CAN.tagsUpdate}>
            <Tooltip heading={t.table.restoreTag} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreTag}
                onClick={() => setRestoring(tag)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.tagsPurge}>
            <Tooltip heading={t.table.purgeTag} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeTag}
                onClick={() => setPurging(tag)}
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
          to: navPaths.tags(language),
          size: 'small',
        },
      ]}
    >
      <div>
        <FadeCollapse show={selectedIds.length > 0}>
          <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-2">
            <span className="text-sm font-medium text-foreground">
              {t.actions.selectedCount(selectedIds.length)}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="small" onClick={clearSelection}>
                {t.actions.clearSelection}
              </Button>
              <Can anyOf={CAN.tagsUpdate}>
                <Button variant="primary" size="small" onClick={() => setBulkAction('restore')}>
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.tagsPurge}>
                <Button variant="error" size="small" onClick={() => setBulkAction('purge')}>
                  {t.actions.bulkPurge}
                </Button>
              </Can>
            </div>
          </div>
        </FadeCollapse>

        <DataTable
          columns={columns}
          rows={tags}
          getRowKey={(tag) => tag.id}
          isLoading={isLoading}
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

      <TagDetailModal tag={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={restoring ? t.actions.restoreDescription(restoring.name[language] || restoring.name.en) : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRestoring(null)} disabled={restore.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" loading={restore.isPending} onClick={handleConfirmRestore}>
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
        description={purging ? t.actions.purgeDescription(purging.name[language] || purging.name.en) : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPurging(null)} disabled={purge.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="error" loading={purge.isPending} onClick={handleConfirmPurge}>
              {t.actions.confirmPurge}
            </Button>
          </>
        }
      />

      <Modal
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        size="sm"
        title={bulkAction === 'restore' ? t.actions.restoreTitle : t.actions.purgeTitle}
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
              variant={bulkAction === 'restore' ? 'primary' : 'error'}
              loading={bulkRestore.isPending || bulkPurge.isPending}
              onClick={handleConfirmBulk}
            >
              {bulkAction === 'restore' ? t.actions.confirmRestore : t.actions.confirmPurge}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
