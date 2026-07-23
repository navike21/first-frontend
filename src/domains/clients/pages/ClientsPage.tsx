import {
  PageContent,
  InputField,
  Select,
  Modal,
  Button,
  ButtonGroup,
  IconComponent,
  FadeCollapse,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { ClientTable } from '../components/ClientTable/ClientTable'
import { ClientDetailModal } from '../components/ClientDetailModal/ClientDetailModal'
import { useClientsPage } from './ClientsPage.hooks'

export const ClientsPage = () => {
  const {
    t,
    language,
    params,
    search,
    clients,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingClient,
    viewingClient,
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
    setDeletingClient,
    setViewingClient,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useClientsPage()

  const canSeeTrash = useHasPermission(...CAN.clientsTrash)
  const canCreate = useHasPermission(...CAN.clientsCreate)

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
                to: navPaths.clientTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newClient,
                variant: 'primary' as const,
                to: navPaths.clientCreate(language),
                size: 'small' as const,
              },
            ]
          : []),
      ]}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <InputField
            label={t.filters.searchLabel}
            placeholder={t.filters.searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSlot={
              <span className="text-muted px-3">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            label={t.filters.statusLabel}
            options={statusOptions}
            value={params.status ?? 'all'}
            lang={language}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        </div>
      </div>

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

        <ClientTable
          clients={clients}
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

      <ClientDetailModal
        client={viewingClient}
        onClose={() => setViewingClient(null)}
      />

      <Modal
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingClient
            ? t.actions.deleteDescription(deletingClient.businessName)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingClient(null)}
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
