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
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { navPaths } from '@/shared/router'
import { useCouponsTrashPage } from './CouponsTrashPage.hooks'
import { CouponDetailModal } from '../components/CouponDetailModal'
import type { Coupon } from '../model/coupon.types'

export const CouponsTrashPage = () => {
  const {
    t,
    language,
    coupons,
    currency,
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
  } = useCouponsTrashPage()

  const columns: DataTableColumn<Coupon>[] = [
    {
      id: 'code',
      header: t.table.colCode,
      cell: (coupon) => (
        <span className="text-foreground font-mono font-medium">{coupon.code}</span>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (coupon) => t.type[coupon.type],
    },
    {
      id: 'value',
      header: t.table.colValue,
      cellClassName: 'text-secondary',
      cell: (coupon) =>
        coupon.type === 'percentage'
          ? `${coupon.value}%`
          : formatCurrency(coupon.value, currency, language),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (coupon) => (coupon.deletedAt ? formatDate(coupon.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (coupon) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCoupon} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCoupon}
              onClick={() => setViewing(coupon)}
            />
          </Tooltip>
          <Can anyOf={CAN.couponsUpdate}>
            <Tooltip heading={t.table.restoreCoupon} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreCoupon}
                onClick={() => setRestoring(coupon)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.couponsPurge}>
            <Tooltip heading={t.table.purgeCoupon} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeCoupon}
                onClick={() => setPurging(coupon)}
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
          to: navPaths.coupons(language),
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
              <Can anyOf={CAN.couponsUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.couponsPurge}>
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
          rows={coupons}
          getRowKey={(coupon) => coupon.id}
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

      <CouponDetailModal coupon={viewing} currency={currency} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={restoring ? t.actions.restoreDescription(restoring.code) : undefined}
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
        description={purging ? t.actions.purgeDescription(purging.code) : undefined}
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
              variant={bulkAction === 'restore' ? 'primary' : 'destructive'}
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
