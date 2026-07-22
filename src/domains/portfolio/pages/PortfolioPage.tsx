import { PageContent, Select, Modal, Button, ButtonGroup, FadeCollapse } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { PortfolioTable } from '../components/PortfolioTable/PortfolioTable'
import { PortfolioDetailModal } from '../components/PortfolioDetailModal/PortfolioDetailModal'
import { usePortfolioPage } from './PortfolioPage.hooks'

export const PortfolioPage = () => {
  const {
    t,
    language,
    params,
    items,
    total,
    page,
    pages,
    isLoading,
    deletingItem,
    viewingItem,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleStatusChange,
    handlePageChange,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = usePortfolioPage()

  const canSeeTrash = useHasPermission(...CAN.portfolioTrash)
  const canCreate = useHasPermission(...CAN.portfolioCreate)

  return (
    <PageContent
      title={t.page.listTitle}
      description={t.page.listDescription}
      actions={[
        ...(canSeeTrash
          ? [{ type: 'link' as const, label: t.actions.viewTrash, variant: 'secondary' as const, to: navPaths.portfolioTrash(language), size: 'small' as const }]
          : []),
        ...(canCreate
          ? [{ type: 'link' as const, label: t.actions.newItem, variant: 'primary' as const, to: navPaths.portfolioCreate(language), size: 'small' as const }]
          : []),
      ]}
    >
      <div className="w-full sm:w-52">
        <Select
          label={t.filters.statusLabel}
          options={statusOptions}
          value={params.status ?? 'all'}
          lang={language}
          onChange={(e) => handleStatusChange(e.target.value)}
        />
      </div>

      <div>
        <FadeCollapse show={selectedIds.length > 0}>
          <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-2">
            <span className="text-sm font-medium text-foreground">
              {t.actions.selectedCount(selectedIds.length)}
            </span>
            <ButtonGroup>
              <Button variant="secondary" size="small" onClick={clearSelection}>
                {t.actions.clearSelection}
              </Button>
              <Button variant="primary" size="small" onClick={() => setBulkConfirmOpen(true)}>
                {t.actions.bulkDelete}
              </Button>
            </ButtonGroup>
          </div>
        </FadeCollapse>

        <PortfolioTable
          items={items}
          isLoading={isLoading}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <PortfolioDetailModal item={viewingItem} onClose={() => setViewingItem(null)} />

      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingItem
            ? t.actions.deleteDescription(deletingItem.name[language] || deletingItem.name.en)
            : undefined
        }
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
            <Button variant="secondary" onClick={() => setBulkConfirmOpen(false)} disabled={bulkSoftDelete.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" loading={bulkSoftDelete.isPending} onClick={handleConfirmBulkDelete}>
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
