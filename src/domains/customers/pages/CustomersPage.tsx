import {
  PageContent,
  FilterBar,
  Modal,
  Button,
  ButtonGroup,
  FadeCollapse,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { CustomerTable } from '../components/CustomerTable'
import { CustomerDetailModal } from '../components/CustomerDetailModal'
import { useCustomersPage } from './CustomersPage.hooks'

export const CustomersPage = () => {
  const {
    t,
    language,
    search,
    statusValue,
    customers,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingCustomer,
    viewingCustomer,
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
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingCustomer,
    setViewingCustomer,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useCustomersPage()

  const canSeeTrash = useHasPermission(...CAN.customersTrash)
  const canCreate = useHasPermission(...CAN.customersCreate)

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
                to: navPaths.customerTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newCustomer,
                variant: 'primary' as const,
                to: navPaths.customerCreate(language),
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

        <CustomerTable
          customers={customers}
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

      <CustomerDetailModal
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />

      <Modal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingCustomer
            ? t.actions.deleteDescription(
                `${deletingCustomer.firstName} ${deletingCustomer.lastName}`
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingCustomer(null)}
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
