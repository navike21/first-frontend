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
import { CouponTable } from '../components/CouponTable'
import { CouponDetailModal } from '../components/CouponDetailModal'
import { useCouponsPage } from './CouponsPage.hooks'

export const CouponsPage = () => {
  const {
    t,
    language,
    search,
    statusValue,
    coupons,
    currency,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingCoupon,
    viewingCoupon,
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
    setDeletingCoupon,
    setViewingCoupon,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useCouponsPage()

  const canSeeTrash = useHasPermission(...CAN.couponsTrash)
  const canCreate = useHasPermission(...CAN.couponsCreate)

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
                to: navPaths.couponTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newCoupon,
                variant: 'primary' as const,
                to: navPaths.couponCreate(language),
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

        <CouponTable
          coupons={coupons}
          currency={currency}
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

      <CouponDetailModal
        coupon={viewingCoupon}
        currency={currency}
        onClose={() => setViewingCoupon(null)}
      />

      <Modal
        isOpen={!!deletingCoupon}
        onClose={() => setDeletingCoupon(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingCoupon ? t.actions.deleteDescription(deletingCoupon.code) : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingCoupon(null)}
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
