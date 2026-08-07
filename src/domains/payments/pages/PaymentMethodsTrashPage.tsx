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
import { navPaths } from '@/shared/router'
import { usePaymentMethodsTrashPage } from './PaymentMethodsTrashPage.hooks'
import { PaymentMethodDetailModal } from '../components/PaymentMethodDetailModal'
import type { PaymentMethod } from '../model/payment.types'

export const PaymentMethodsTrashPage = () => {
  const {
    t,
    language,
    methods,
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
  } = usePaymentMethodsTrashPage()

  const columns: DataTableColumn<PaymentMethod>[] = [
    {
      id: 'card',
      header: t.table.colCard,
      cellClassName: 'font-mono',
      cell: (method) => (
        <span className="text-foreground font-medium">
          {method.brand} •••• {method.last4}
        </span>
      ),
    },
    {
      id: 'provider',
      header: t.table.colProvider,
      cellClassName: 'text-secondary',
      cell: (method) => method.provider,
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (method) => (method.deletedAt ? formatDate(method.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (method) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewMethod} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewMethod}
              onClick={() => setViewing(method)}
            />
          </Tooltip>
          <Can anyOf={CAN.paymentMethodsUpdate}>
            <Tooltip heading={t.table.restoreMethod} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreMethod}
                onClick={() => setRestoring(method)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.paymentMethodsPurge}>
            <Tooltip heading={t.table.purgeMethod} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeMethod}
                onClick={() => setPurging(method)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ]

  return (
    <PageContent
      title={t.page.methodsTrashTitle}
      description={t.page.methodsTrashDescription}
      actions={[
        {
          type: 'link',
          label: t.actions.cancel,
          variant: 'secondary',
          to: navPaths.paymentMethods(language),
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
              <Can anyOf={CAN.paymentMethodsUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.paymentMethodsPurge}>
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
          rows={methods}
          getRowKey={(method) => method.id}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon="RiDeleteBinLine"
          emptyLabel={t.page.methodsTrashEmpty}
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

      <PaymentMethodDetailModal method={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={restoring ? t.actions.restoreDescription(restoring.brand) : undefined}
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
        description={purging ? t.actions.purgeDescription(purging.brand) : undefined}
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
