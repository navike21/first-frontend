import {
  Can,
  Chip,
  DataTable,
  IconButton,
  IconComponent,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { useProductReviewsTranslation } from '../../i18n'
import type { ProductReview, ProductReviewStatus } from '../../model/productReview.types'

const STATUS_CHIP_VARIANT: Record<
  ProductReviewStatus,
  'default' | 'success' | 'warning' | 'error'
> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

interface ProductReviewTableProps {
  reviews: ProductReview[]
  productNameById: Record<string, string>
  reviewerNameById: Record<string, string>
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (review: ProductReview) => void
  onApprove: (review: ProductReview) => void
  onReject: (review: ProductReview) => void
  onDelete: (review: ProductReview) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

function reviewerLabel(
  review: ProductReview,
  reviewerNameById: Record<string, string>
): string {
  if (review.customerId) return reviewerNameById[review.customerId] ?? review.guestName ?? '—'
  return review.guestName ?? '—'
}

export const ProductReviewTable = ({
  reviews,
  productNameById,
  reviewerNameById,
  isLoading,
  isFetching,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onApprove,
  onReject,
  onDelete,
  selectedIds,
  onSelectionChange,
}: ProductReviewTableProps) => {
  const { t } = useProductReviewsTranslation()

  const columns: DataTableColumn<ProductReview>[] = [
    {
      id: 'product',
      header: t.table.colProduct,
      cell: (review) => (
        <span className="text-foreground font-medium">
          {productNameById[review.productId] ?? '—'}
        </span>
      ),
    },
    {
      id: 'reviewer',
      header: t.table.colReviewer,
      cellClassName: 'text-secondary',
      cell: (review) => reviewerLabel(review, reviewerNameById),
    },
    {
      id: 'rating',
      header: t.table.colRating,
      cell: (review) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <IconComponent
              key={i}
              icon={i < review.rating ? 'RiStarFill' : 'RiStarLine'}
              className={i < review.rating ? 'text-chip-warning-text size-4' : 'text-disabled size-4'}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (review) => (
        <Chip size="small" variant={STATUS_CHIP_VARIANT[review.status]}>
          {t.status[review.status]}
        </Chip>
      ),
    },
    {
      id: 'date',
      header: t.table.colDate,
      cellClassName: 'text-secondary',
      cell: (review) => (review.createdAt ? formatDate(review.createdAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (review) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewReview} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewReview}
              onClick={() => onView(review)}
            />
          </Tooltip>
          <Can anyOf={CAN.productReviewsUpdate}>
            {review.status !== 'approved' && (
              <Tooltip heading={t.table.approveReview} position="top" size="small">
                <IconButton
                  icon="RiCheckLine"
                  variant="text"
                  size="small"
                  aria-label={t.table.approveReview}
                  onClick={() => onApprove(review)}
                />
              </Tooltip>
            )}
            {review.status !== 'rejected' && (
              <Tooltip heading={t.table.rejectReview} position="top" size="small">
                <IconButton
                  icon="RiCloseLine"
                  variant="text"
                  size="small"
                  aria-label={t.table.rejectReview}
                  onClick={() => onReject(review)}
                />
              </Tooltip>
            )}
          </Can>
          <Can anyOf={CAN.productReviewsDelete}>
            <Tooltip heading={t.table.deleteReview} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteReview}
                onClick={() => onDelete(review)}
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
      rows={reviews}
      getRowKey={(review) => review.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiStarLine"
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
