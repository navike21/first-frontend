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
import { useCategoriesTrashPage } from './CategoriesTrashPage.hooks'
import { CategoryDetailModal } from '../components/CategoryDetailModal/CategoryDetailModal'
import type { Category } from '../model/category.types'

export const CategoriesTrashPage = () => {
  const {
    t,
    language,
    categories,
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
  } = useCategoriesTrashPage()

  const columns: DataTableColumn<Category>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (category) => (
        <span className="text-foreground font-medium">
          {category.name[language] || category.name.en}
        </span>
      ),
    },
    {
      id: 'slug',
      header: t.table.colSlug,
      cellClassName: 'text-secondary',
      cell: (category) => category.slug,
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (category) => (
        <Chip size="small" variant={category.isActive ? 'success' : 'default'}>
          {category.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (category) =>
        category.deletedAt ? formatDate(category.deletedAt) : '—',
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCategory} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCategory}
              onClick={() => setViewing(category)}
            />
          </Tooltip>
          <Can anyOf={CAN.categoriesUpdate}>
            <Tooltip
              heading={t.table.restoreCategory}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreCategory}
                onClick={() => setRestoring(category)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.categoriesPurge}>
            <Tooltip
              heading={t.table.purgeCategory}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeCategory}
                onClick={() => setPurging(category)}
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
          to: navPaths.categories(language),
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
              <Can anyOf={CAN.categoriesUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.categoriesPurge}>
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
          rows={categories}
          getRowKey={(category) => category.id}
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

      <CategoryDetailModal
        category={viewing}
        onClose={() => setViewing(null)}
      />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoring
            ? t.actions.restoreDescription(
                restoring.name[language] || restoring.name.en
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
                purging.name[language] || purging.name.en
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
