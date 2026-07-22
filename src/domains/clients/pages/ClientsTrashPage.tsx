import {
  PageContent,
  DataTable,
  Avatar,
  Button, ButtonGroup,
  CountryLabel,
  IconButton,
  Tooltip,
  Modal,
  FadeCollapse,
  Can,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useConfigData, labelFor } from '@/shared/api/config'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import { useClientsTrashPage } from './ClientsTrashPage.hooks'
import { ClientDetailModal } from '../components/ClientDetailModal/ClientDetailModal'
import type { Client } from '../model/client.types'

export const ClientsTrashPage = () => {
  const {
    t,
    language,
    clients,
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
  } = useClientsTrashPage()

  const { data: config } = useConfigData(['industries', 'clientTypes'], language)

  const columns: DataTableColumn<Client>[] = [
    {
      id: 'businessName',
      header: t.table.colBusinessName,
      cell: (client) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={client.businessName}
            src={client.logoUrl}
            name={client.businessName}
            size="sm"
          />
          <span className="font-medium text-foreground">
            {client.businessName}
          </span>
        </div>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (client) => labelFor(config?.clientTypes, client.clientType),
    },
    {
      id: 'country',
      header: t.table.colCountry,
      cellClassName: 'text-secondary',
      cell: (client) => <CountryLabel code={client.country} />,
    },
    {
      id: 'industry',
      header: t.table.colIndustry,
      cellClassName: 'text-secondary',
      cell: (client) => labelFor(config?.industries, client.industry) || '—',
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (client) => (client.deletedAt ? formatDate(client.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (client) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewClient} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewClient}
              onClick={() => setViewing(client)}
            />
          </Tooltip>
          <Can anyOf={CAN.clientsUpdate}>
            <Tooltip heading={t.table.restoreClient} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreClient}
                onClick={() => setRestoring(client)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.clientsPurge}>
            <Tooltip heading={t.table.purgeClient} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeClient}
                onClick={() => setPurging(client)}
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
          to: navPaths.clients(language),
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
            <ButtonGroup>
              <Button variant="secondary" size="small" onClick={clearSelection}>
                {t.actions.clearSelection}
              </Button>
              <Can anyOf={CAN.clientsUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.clientsPurge}>
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
          rows={clients}
          getRowKey={(client) => client.id}
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

      <ClientDetailModal client={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoring
            ? t.actions.restoreDescription(restoring.businessName)
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
          purging ? t.actions.purgeDescription(purging.businessName) : undefined
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
