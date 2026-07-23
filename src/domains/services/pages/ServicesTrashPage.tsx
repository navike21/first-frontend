import {
  PageContent,
  DataTable,
  Avatar,
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
import { useServicesTrashPage } from './ServicesTrashPage.hooks'
import { ServiceDetailModal } from '../components/ServiceDetailModal/ServiceDetailModal'
import type { Service } from '../model/service.types'

export const ServicesTrashPage = () => {
  const {
    t,
    language,
    services,
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
  } = useServicesTrashPage()

  const columns: DataTableColumn<Service>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (svc) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={svc.name[language] || svc.name.en}
            src={svc.coverImageUrl}
            name={svc.name[language] || svc.name.en}
            size="sm"
          />
          <span className="text-foreground font-medium">
            {svc.name[language] || svc.name.en}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (svc) => (
        <Chip
          size="small"
          variant={svc.status === 'active' ? 'success' : 'default'}
        >
          {t.status[svc.status]}
        </Chip>
      ),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (svc) => (svc.deletedAt ? formatDate(svc.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (svc) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewService} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewService}
              onClick={() => setViewing(svc)}
            />
          </Tooltip>
          <Can anyOf={CAN.servicesUpdate}>
            <Tooltip
              heading={t.table.restoreService}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreService}
                onClick={() => setRestoring(svc)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.servicesPurge}>
            <Tooltip heading={t.table.purgeService} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeService}
                onClick={() => setPurging(svc)}
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
          to: navPaths.services(language),
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
              <Can anyOf={CAN.servicesUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.servicesPurge}>
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
          rows={services}
          getRowKey={(svc) => svc.id}
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

      <ServiceDetailModal service={viewing} onClose={() => setViewing(null)} />

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
