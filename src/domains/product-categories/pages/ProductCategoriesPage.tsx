import {
  PageContent,
  FilterBar,
  Modal,
  Button,
  ButtonGroup,
  FadeCollapse,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { ProductCategoryTable } from '../components/ProductCategoryTable'
import { ProductCategoryDetailModal } from '../components/ProductCategoryDetailModal'
import { useProductCategoriesPage } from './ProductCategoriesPage.hooks'

export const ProductCategoriesPage = () => {
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
    isFetching,
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
  } = useProductCategoriesPage()

  const canSeeTrash = useHasPermission(...CAN.productCategoriesTrash)
  const canCreate = useHasPermission(...CAN.productCategoriesCreate)

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
                to: navPaths.productCategoryTrash(language),
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
                to: navPaths.productCategoryCreate(language),
                size: 'small' as const,
              },
            ]
          : []),
      ]}
    >
      <FilterBar
        search={{
          value: search,
          onChange: handleSearchChange,
          label: t.filters.searchLabel,
          placeholder: t.filters.searchPlaceholder,
        }}
        filters={[
          {
            id: 'status',
            label: t.filters.statusLabel,
            options: statusOptions,
            value: statusValue,
            onChange: handleStatusChange,
          },
        ]}
        lang={language}
      />

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

        <ProductCategoryTable
          categories={categories}
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

      <ProductCategoryDetailModal
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
      />

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingCategory
            ? t.actions.deleteDescription(
                deletingCategory.name[language] || deletingCategory.name.en
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingCategory(null)}
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
