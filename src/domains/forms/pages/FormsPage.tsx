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
import { FormTable } from '../components/FormTable'
import { useFormsPage } from './FormsPage.hooks'

export const FormsPage = () => {
  const {
    t,
    language,
    params,
    search,
    forms,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingForm,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleEdit,
    handleDelete,
    handleViewSubmissions,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingForm,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useFormsPage()

  const canSeeTrash = useHasPermission(...CAN.formsTrash)
  const canCreate = useHasPermission(...CAN.formsCreate)

  const formTitle = (f: typeof deletingForm) =>
    f ? f.title[language] || f.title.en : ''

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
                to: navPaths.formTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newForm,
                variant: 'primary' as const,
                to: navPaths.formCreate(language),
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

        <FormTable
          forms={forms}
          isLoading={isLoading}
          isFetching={isFetching}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewSubmissions={handleViewSubmissions}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <Modal
        isOpen={!!deletingForm}
        onClose={() => setDeletingForm(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingForm
            ? t.actions.deleteDescription(formTitle(deletingForm))
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingForm(null)}
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
