import { PageContent, FilterBar, Modal, Button, ButtonGroup, FadeCollapse } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { ProductReviewTable } from '../components/ProductReviewTable'
import { ProductReviewDetailModal } from '../components/ProductReviewDetailModal'
import { useProductReviewsPage } from './ProductReviewsPage.hooks'

export const ProductReviewsPage = () => {
  const {
    t,
    language,
    search,
    statusValue,
    reviews,
    productNameById,
    customersById,
    reviewerNameById,
    reviewerLabel,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    viewing,
    deleting,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleDelete,
    handleApprove,
    handleReject,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setViewing,
    setDeleting,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useProductReviewsPage()

  const canSeeTrash = useHasPermission(...CAN.productReviewsTrash)

  return (
    <PageContent
      title={t.page.listTitle}
      description={t.page.listDescription}
      actions={[
        ...(canSeeTrash
          ? [
              {
                type: 'link' as const,
                label: t.actions.viewTrash,
                variant: 'secondary' as const,
                to: navPaths.productReviewTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
      ]}
    >
      <FilterBar
        search={{
          value: search,
          onChange: handleSearchChange,
          label: t.filters.searchLabel,
          placeholder: t.filters.searchPlaceholder,
        }}
        filters={[
          {
            id: 'status',
            label: t.filters.statusLabel,
            options: statusOptions,
            value: statusValue,
            onChange: handleStatusChange,
          },
        ]}
        lang={language}
      />

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
              <Button
                variant="primary"
                size="small"
                onClick={() => setBulkConfirmOpen(true)}
              >
                {t.actions.bulkDelete}
              </Button>
            </ButtonGroup>
          </div>
        </FadeCollapse>

        <ProductReviewTable
          reviews={reviews}
          productNameById={productNameById}
          reviewerNameById={reviewerNameById}
          isLoading={isLoading}
          isFetching={isFetching}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <ProductReviewDetailModal
        review={viewing}
        productNameById={productNameById}
        customersById={customersById}
        onClose={() => setViewing(null)}
      />

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={deleting ? t.actions.deleteDescription(reviewerLabel(deleting)) : undefined}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleting(null)}
              disabled={softDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={softDelete.isPending}
              onClick={handleConfirmDelete}
            >
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
            <Button
              variant="secondary"
              onClick={() => setBulkConfirmOpen(false)}
              disabled={bulkSoftDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={bulkSoftDelete.isPending}
              onClick={handleConfirmBulkDelete}
            >
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
