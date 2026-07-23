import { useState } from 'react'
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
import { PageTable } from '../components/PageTable/PageTable'
import { PageDetailModal } from '../components/PageDetailModal/PageDetailModal'
import { PageSeoDrawer } from '../components/PageSeoDrawer'
import type { Page } from '../model/page.types'
import { usePagesPage } from './PagesPage.hooks'

export const PagesPage = () => {
  const {
    t,
    language,
    search,
    params,
    items,
    total,
    page,
    pages,
    isLoading,
    deletingItem,
    viewingItem,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleBuild,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = usePagesPage()

  const canSeeTrash = useHasPermission(...CAN.pagesTrash)
  const canCreate = useHasPermission(...CAN.pagesCreate)
  const [seoItem, setSeoItem] = useState<Page | null>(null)

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
                to: navPaths.pageTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newItem,
                variant: 'primary' as const,
                to: navPaths.pageCreate(language),
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

        <PageTable
          items={items}
          isLoading={isLoading}
          total={total}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSeo={setSeoItem}
          onBuild={handleBuild}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <PageDetailModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />

      <PageSeoDrawer item={seoItem} onClose={() => setSeoItem(null)} />

      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingItem
            ? t.actions.deleteDescription(
                deletingItem.title[language] || deletingItem.title.en
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingItem(null)}
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
