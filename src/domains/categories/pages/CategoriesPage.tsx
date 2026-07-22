import {
  PageContent,
  InputField,
  Select,
  Modal,
  Button, ButtonGroup,
  IconComponent,
  FadeCollapse,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { CategoryTable } from '../components/CategoryTable/CategoryTable'
import { CategoryDetailModal } from '../components/CategoryDetailModal/CategoryDetailModal'
import { useCategoriesPage } from './CategoriesPage.hooks'

export const CategoriesPage = () => {
  const {
    t,
    language,
    search,
    statusValue,
    categories,
    total,
    page,
    pages,
    isLoading,
    deletingCategory,
    viewingCategory,
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
    setDeletingCategory,
    setViewingCategory,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useCategoriesPage()

  const canSeeTrash = useHasPermission(...CAN.categoriesTrash)
  const canCreate = useHasPermission(...CAN.categoriesCreate)

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
                to: navPaths.categoryTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newCategory,
                variant: 'primary' as const,
                to: navPaths.categoryCreate(language),
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
              <span className="px-3 text-muted">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            label={t.filters.statusLabel}
            options={statusOptions}
            value={statusValue}
            lang={language}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        </div>
      </div>

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
              <Button variant="primary" size="small" onClick={() => setBulkConfirmOpen(true)}>
                {t.actions.bulkDelete}
              </Button>
            </ButtonGroup>
          </div>
        </FadeCollapse>

        <CategoryTable
          categories={categories}
          isLoading={isLoading}
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

      <CategoryDetailModal category={viewingCategory} onClose={() => setViewingCategory(null)} />

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingCategory ? t.actions.deleteDescription(deletingCategory.name[language] || deletingCategory.name.en) : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingCategory(null)} disabled={softDelete.isPending}>
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
            <Button variant="secondary" onClick={() => setBulkConfirmOpen(false)} disabled={bulkSoftDelete.isPending}>
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
