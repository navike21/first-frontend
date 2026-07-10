import clsx from 'clsx'
import {
  ActionMenu,
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type ActionMenuItem,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN, useHasPermission } from '@/shared/lib/permissions'
import { usePagesTranslation } from '../../i18n'
import { useCategoriesForPagePicker, useTagsForPagePicker } from '../../api/pages.queries'
import { analyzePageSeo } from '../../model/page.seo'
import type { SeoLight } from '../../model/page.seo'
import type { Page, PageStatus } from '../../model/page.types'

interface PageTableProps {
  items: Page[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (item: Page) => void
  onEdit: (item: Page) => void
  onDelete: (item: Page) => void
  onSeo: (item: Page) => void
  onBuild: (item: Page) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

const STATUS_VARIANT: Record<PageStatus, 'success' | 'warning' | 'informative'> = {
  published: 'success',
  scheduled: 'informative',
  draft: 'warning',
}

const SEO_LIGHT_CLASS: Record<SeoLight, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

function pathDepth(fullPath: string | undefined): number {
  if (!fullPath) return 0
  return fullPath.split('/').filter(Boolean).length - 1
}

export const PageTable = ({
  items,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onSeo,
  onBuild,
  selectedIds,
  onSelectionChange,
}: PageTableProps) => {
  const { t, language } = usePagesTranslation()
  const { data: categoriesData } = useCategoriesForPagePicker()
  const { data: tagsData } = useTagsForPagePicker()
  const canUpdate = useHasPermission(...CAN.pagesUpdate)
  const canDelete = useHasPermission(...CAN.pagesDelete)

  // Hybrid action pattern: the most frequent action (edit) stays one click
  // away; the rest collapse into the "more actions" menu.
  const menuItemsFor = (item: Page): ActionMenuItem[] => [
    { id: 'view', label: t.table.viewItem, icon: 'RiEyeLine', onClick: () => onView(item) },
    { id: 'seo', label: t.seo.action, icon: 'RiSearchEyeLine', onClick: () => onSeo(item) },
    ...(canUpdate
      ? [{ id: 'build', label: t.table.buildItem, icon: 'RiLayout4Line', onClick: () => onBuild(item) } as const]
      : []),
    ...(canDelete
      ? [
          {
            id: 'delete',
            label: t.table.deleteItem,
            icon: 'RiDeleteBinLine',
            onClick: () => onDelete(item),
            danger: true,
          } as const,
        ]
      : []),
  ]

  const categoryLabel = (id: string) => categoriesData?.find((c) => c.id === id)?.name[language]
  const tagLabel = (id: string) => tagsData?.find((tag) => tag.id === id)?.name[language]

  const columns: DataTableColumn<Page>[] = [
    {
      id: 'title',
      header: t.table.colTitle,
      cell: (item) => {
        const depth = pathDepth(item.fullPath?.[language])
        return (
          <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {depth > 0 && <span className="text-muted">└</span>}
            <span className="font-medium text-foreground">{item.title[language] || item.title.en}</span>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (item) => {
        const effective = item.effectiveStatus ?? item.status
        return (
          <div className="flex flex-col items-start gap-0.5">
            <Chip size="small" variant={STATUS_VARIANT[effective]}>
              {t.status[effective]}
            </Chip>
            {item.status === 'scheduled' && item.scheduledAt && effective === 'scheduled' && (
              <span className="text-xs text-muted">{t.table.scheduledFor(new Date(item.scheduledAt).toLocaleString(language))}</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'seo',
      header: t.seo.colSeo,
      cell: (item) => {
        const analysis = analyzePageSeo(item, language)
        return (
          <Tooltip
            heading={`${analysis.score}% · ${t.seo.summary(analysis.goodCount, analysis.warningCount, analysis.badCount)}`}
            position="top"
            size="small"
          >
            <button
              type="button"
              aria-label={t.seo.action}
              onClick={() => onSeo(item)}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <span className={clsx('h-2.5 w-2.5 rounded-full', SEO_LIGHT_CLASS[analysis.light])} />
              <span className="text-xs text-secondary">{analysis.score}%</span>
            </button>
          </Tooltip>
        )
      },
    },
    {
      id: 'categories',
      header: t.table.colCategories,
      cellClassName: 'text-secondary',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.categoryIds.length === 0 && '—'}
          {item.categoryIds.map((id) => (
            <Chip key={id} size="x-small" variant="default">
              {categoryLabel(id) ?? id}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      id: 'tags',
      header: t.table.colTags,
      cellClassName: 'text-secondary',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.tagIds.length === 0 && '—'}
          {item.tagIds.map((id) => (
            <Chip key={id} size="x-small" variant="default">
              {tagLabel(id) ?? id}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Can anyOf={CAN.pagesUpdate}>
            <Tooltip heading={t.table.editItem} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editItem}
                onClick={() => onEdit(item)}
              />
            </Tooltip>
          </Can>
          <ActionMenu items={menuItemsFor(item)} triggerLabel={t.table.moreActions} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowKey={(item) => item.id}
      isLoading={isLoading}
      emptyIcon="RiFileTextLine"
      emptyLabel={t.table.noResults}
      totalLabel={t.table.totalCount(total)}
      pagination={{
        page,
        pages,
        onPageChange,
        prevLabel: t.table.prevPage,
        nextLabel: t.table.nextPage,
      }}
      selectable={!!onSelectionChange}
      {...(selectedIds !== undefined && { selectedIds })}
      {...(onSelectionChange !== undefined && { onSelectionChange })}
      selectAllLabel={t.table.selectAll}
      selectRowLabel={t.table.selectRow}
    />
  )
}
