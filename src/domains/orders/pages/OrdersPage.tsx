import { PageContent, FilterBar, Modal, Button, ButtonGroup, FadeCollapse } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { OrderTable } from '../components/OrderTable'
import { useOrdersPage } from './OrdersPage.hooks'

export const OrdersPage = () => {
  const {
    t,
    language,
    search,
    statusValue,
    paymentStatusValue,
    orders,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingOrder,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    paymentStatusOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePageChange,
    setDeletingOrder,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useOrdersPage()

  const canSeeTrash = useHasPermission(...CAN.ordersTrash)
  const canCreate = useHasPermission(...CAN.ordersCreate)

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
                to: navPaths.orderTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newOrder,
                variant: 'primary' as const,
                to: navPaths.orderCreate(language),
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
          {
            id: 'paymentStatus',
            label: t.filters.paymentStatusLabel,
            options: paymentStatusOptions,
            value: paymentStatusValue,
            onChange: handlePaymentStatusChange,
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

        <OrderTable
          orders={orders}
          isLoading={isLoading}
          isFetching={isFetching}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onView={handleView}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <Modal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingOrder ? t.actions.deleteDescription(deletingOrder.orderNumber) : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingOrder(null)}
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
