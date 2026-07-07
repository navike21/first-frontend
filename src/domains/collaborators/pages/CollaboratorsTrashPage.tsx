import {
  PageContent,
  DataTable,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Modal,
  FadeCollapse,
  Can,
  Chip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useConfigData, labelFor } from '@/shared/api/config'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import { useCollaboratorsTrashPage } from './CollaboratorsTrashPage.hooks'
import { CollaboratorDetailModal } from '../components/CollaboratorDetailModal/CollaboratorDetailModal'
import type { Collaborator } from '../model/collaborator.types'

export const CollaboratorsTrashPage = () => {
  const {
    t,
    language,
    collaborators,
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
  } = useCollaboratorsTrashPage()

  const { data: configData } = useConfigData(['collaboratorRoles'], language)

  const columns: DataTableColumn<Collaborator>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (collaborator) => (
        <div className="flex items-center gap-3">
          <Avatar alt={collaborator.name} src={collaborator.photoUrl} name={collaborator.name} size="sm" />
          <span className="font-medium text-foreground">{collaborator.name}</span>
        </div>
      ),
    },
    {
      id: 'role',
      header: t.table.colRole,
      cellClassName: 'text-secondary',
      cell: (collaborator) => labelFor(configData?.collaboratorRoles, collaborator.role),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (collaborator) => (
        <Chip size="small" variant={collaborator.isActive ? 'success' : 'default'}>
          {collaborator.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (collaborator) => (collaborator.deletedAt ? formatDate(collaborator.deletedAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (collaborator) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCollaborator} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCollaborator}
              onClick={() => setViewing(collaborator)}
            />
          </Tooltip>
          <Can anyOf={CAN.collaboratorsUpdate}>
            <Tooltip heading={t.table.restoreCollaborator} position="top" size="small">
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.table.restoreCollaborator}
                onClick={() => setRestoring(collaborator)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.collaboratorsPurge}>
            <Tooltip heading={t.table.purgeCollaborator} position="top" size="small">
              <IconButton
                icon="RiDeleteBin6Line"
                variant="text"
                size="small"
                aria-label={t.table.purgeCollaborator}
                onClick={() => setPurging(collaborator)}
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
          to: navPaths.collaborators(language),
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
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="small" onClick={clearSelection}>
                {t.actions.clearSelection}
              </Button>
              <Can anyOf={CAN.collaboratorsUpdate}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkAction('restore')}
                >
                  {t.actions.bulkRestore}
                </Button>
              </Can>
              <Can anyOf={CAN.collaboratorsPurge}>
                <Button
                  variant="error"
                  size="small"
                  onClick={() => setBulkAction('purge')}
                >
                  {t.actions.bulkPurge}
                </Button>
              </Can>
            </div>
          </div>
        </FadeCollapse>

        <DataTable
          columns={columns}
          rows={collaborators}
          getRowKey={(collaborator) => collaborator.id}
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

      <CollaboratorDetailModal collaborator={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoring ? t.actions.restoreDescription(restoring.name) : undefined
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
          purging ? t.actions.purgeDescription(purging.name) : undefined
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
              variant="error"
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
          bulkAction === 'restore' ? t.actions.restoreTitle : t.actions.purgeTitle
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
              variant={bulkAction === 'restore' ? 'primary' : 'error'}
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
