import { PageContent, Modal, Button, ButtonGroup, FadeCollapse } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { PaymentMethodTable } from '../components/PaymentMethodTable'
import { PaymentMethodDetailModal } from '../components/PaymentMethodDetailModal'
import { usePaymentMethodsPage } from './PaymentMethodsPage.hooks'

export const PaymentMethodsPage = () => {
  const {
    t,
    language,
    methods,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingMethod,
    viewingMethod,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handlePageChange,
    setDeletingMethod,
    setViewingMethod,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = usePaymentMethodsPage()

  const canSeeTrash = useHasPermission(...CAN.paymentMethodsTrash)
  const canCreate = useHasPermission(...CAN.paymentMethodsCreate)

  return (
    <PageContent
      title={t.page.methodsListTitle}
      description={t.page.methodsListDescription}
      actions={[
        ...(canSeeTrash
          ? [
              {
                type: 'link' as const,
                label: t.actions.viewTrash,
                variant: 'secondary' as const,
                to: navPaths.paymentMethodTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newMethod,
                variant: 'primary' as const,
                to: navPaths.paymentMethodCreate(language),
                size: 'small' as const,
              },
            ]
          : []),
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

        <PaymentMethodTable
          methods={methods}
          isLoading={isLoading}
          isFetching={isFetching}
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

      <PaymentMethodDetailModal method={viewingMethod} onClose={() => setViewingMethod(null)} />

      <Modal
        isOpen={!!deletingMethod}
        onClose={() => setDeletingMethod(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingMethod ? t.actions.deleteDescription(deletingMethod.brand) : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingMethod(null)}
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
