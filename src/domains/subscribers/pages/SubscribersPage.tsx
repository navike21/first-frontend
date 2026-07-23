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
import { SubscriberTable } from '../components/SubscriberTable/SubscriberTable'
import { SubscriberDetailModal } from '../components/SubscriberDetailModal/SubscriberDetailModal'
import { useSubscribersPage } from './SubscribersPage.hooks'

export const SubscribersPage = () => {
  const {
    t,
    language,
    params,
    search,
    subscribers,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingSubscriber,
    viewingSubscriber,
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
    setDeletingSubscriber,
    setViewingSubscriber,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useSubscribersPage()

  const canSeeTrash = useHasPermission(...CAN.subscribersTrash)
  const canCreate = useHasPermission(...CAN.subscribersCreate)

  const subscriberName = (s: typeof deletingSubscriber) =>
    s ? `${s.firstName} ${s.lastName}` : ''

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
                to: navPaths.subscriberTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newSubscriber,
                variant: 'primary' as const,
                to: navPaths.subscriberCreate(language),
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

        <SubscriberTable
          subscribers={subscribers}
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

      <SubscriberDetailModal
        subscriber={viewingSubscriber}
        onClose={() => setViewingSubscriber(null)}
      />

      <Modal
        isOpen={!!deletingSubscriber}
        onClose={() => setDeletingSubscriber(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingSubscriber
            ? t.actions.deleteDescription(subscriberName(deletingSubscriber))
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingSubscriber(null)}
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
