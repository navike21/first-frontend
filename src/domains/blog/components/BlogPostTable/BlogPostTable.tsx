import {
  Avatar,
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useBlogTranslation } from '../../i18n'
import {
  useCategoriesForBlogPicker,
  useTagsForBlogPicker,
  useCollaboratorsForBlogPicker,
} from '../../api/blog.queries'
import type { Post, BlogStatus } from '../../model/blog.types'

interface BlogPostTableProps {
  items: Post[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (item: Post) => void
  onEdit: (item: Post) => void
  onDelete: (item: Post) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

const STATUS_VARIANT: Record<
  BlogStatus,
  'success' | 'warning' | 'informative'
> = {
  published: 'success',
  scheduled: 'informative',
  draft: 'warning',
}

export const BlogPostTable = ({
  items,
  isLoading,
  isFetching,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: BlogPostTableProps) => {
  const { t, language } = useBlogTranslation()
  const { data: categoriesData } = useCategoriesForBlogPicker()
  const { data: tagsData } = useTagsForBlogPicker()
  const { data: collaboratorsData } = useCollaboratorsForBlogPicker()

  const categoryLabel = (id: string) =>
    categoriesData?.find((c) => c.id === id)?.name[language]
  const tagLabel = (id: string) =>
    tagsData?.find((tag) => tag.id === id)?.name[language]
  const authorName = (id: string | undefined) =>
    collaboratorsData?.find((c) => c.id === id)?.name

  const columns: DataTableColumn<Post>[] = [
    {
      id: 'title',
      header: t.table.colTitle,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={item.title[language] || item.title.en}
            src={item.coverImageUrl}
            name={item.title[language] || item.title.en}
            size="sm"
          />
          <span className="text-foreground block truncate font-medium">
            {item.title[language] || item.title.en}
          </span>
        </div>
      ),
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
            {item.status === 'scheduled' &&
              item.scheduledAt &&
              effective === 'scheduled' && (
                <span className="text-muted text-xs">
                  {t.table.scheduledFor(
                    new Date(item.scheduledAt).toLocaleString(language)
                  )}
                </span>
              )}
          </div>
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
      id: 'author',
      header: t.table.colAuthor,
      cellClassName: 'text-secondary',
      cell: (item) => authorName(item.authorId) ?? '—',
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewItem} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewItem}
              onClick={() => onView(item)}
            />
          </Tooltip>
          <Can anyOf={CAN.blogUpdate}>
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
          <Can anyOf={CAN.blogDelete}>
            <Tooltip heading={t.table.deleteItem} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteItem}
                onClick={() => onDelete(item)}
              />
            </Tooltip>
          </Can>
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
      isFetching={isFetching}
      emptyIcon="RiArticleLine"
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
