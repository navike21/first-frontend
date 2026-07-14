import { PageContent, Select, Modal, Button, FadeCollapse, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { FormSubmissionTable } from '../components/FormSubmissionTable'
import { FormSubmissionDetailModal } from '../components/FormSubmissionDetailModal'
import { useFormSubmissionsPage } from './FormSubmissionsPage.hooks'

export const FormSubmissionsPage = () => {
  const {
    t,
    language,
    form,
    readFilter,
    submissions,
    total,
    page,
    pages,
    isLoading,
    viewing,
    deleting,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    readOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleReadFilterChange,
    handlePageChange,
    setViewing,
    setDeleting,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useFormSubmissionsPage()

  if (!form) {
    return (
      <PageContent title={t.page.submissionsTitle('')} description={t.page.submissionsDescription}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent
      title={t.page.submissionsTitle(form.title[language] || form.title.en)}
      description={t.page.submissionsDescription}
      actions={[
        {
          type: 'link',
          label: t.actions.cancel,
          variant: 'secondary',
          to: navPaths.forms(language),
          size: 'small',
        },
      ]}
    >
      <div className="w-full sm:w-52">
        <Select
          label={t.filters.readLabel}
          options={readOptions}
          value={readFilter}
          lang={language}
          onChange={(e) => handleReadFilterChange(e.target.value)}
        />
      </div>

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
              <Button variant="primary" size="small" onClick={() => setBulkConfirmOpen(true)}>
                {t.actions.bulkDelete}
              </Button>
            </div>
          </div>
        </FadeCollapse>

        <FormSubmissionTable
          form={form}
          submissions={submissions}
          isLoading={isLoading}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onView={handleView}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <FormSubmissionDetailModal form={form} submission={viewing} onClose={() => setViewing(null)} />

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={t.submissionsTable.deleteSubmissionDescription}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)} disabled={softDelete.isPending}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" loading={softDelete.isPending} onClick={handleConfirmDelete}>
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
            <Button variant="primary" loading={bulkSoftDelete.isPending} onClick={handleConfirmBulkDelete}>
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
