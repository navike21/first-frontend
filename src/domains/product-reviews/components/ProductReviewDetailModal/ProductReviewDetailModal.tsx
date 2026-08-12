import { Modal, DetailField, Chip, IconComponent } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { useProductReviewsTranslation } from '../../i18n'
import type { ProductReview, ProductReviewStatus } from '../../model/productReview.types'
import type { ProductReviewCustomerPickerItem } from '../../api/productReviews.queries'

const STATUS_CHIP_VARIANT: Record<
  ProductReviewStatus,
  'default' | 'success' | 'warning' | 'error'
> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

interface ProductReviewDetailModalProps {
  review: ProductReview | null
  productNameById: Record<string, string>
  customersById: Record<string, ProductReviewCustomerPickerItem>
  onClose: () => void
}

export const ProductReviewDetailModal = ({
  review,
  productNameById,
  customersById,
  onClose,
}: ProductReviewDetailModalProps) => {
  const { t } = useProductReviewsTranslation()

  const customer = review?.customerId ? customersById[review.customerId] : undefined
  const reviewerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : (review?.guestName ?? '—')
  const reviewerEmail = customer?.email ?? review?.guestEmail ?? '—'

  return (
    <Modal isOpen={!!review} onClose={onClose} size="lg" title={t.detail.title}>
      {review && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label={t.detail.product}
              value={productNameById[review.productId] ?? '—'}
            />
            <DetailField
              label={t.detail.status}
              value={
                <Chip size="small" variant={STATUS_CHIP_VARIANT[review.status]}>
                  {t.status[review.status]}
                </Chip>
              }
            />
            <DetailField label={t.detail.reviewer} value={reviewerName} />
            <DetailField label={t.detail.email} value={reviewerEmail} />
            <DetailField
              label={t.detail.rating}
              value={
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <IconComponent
                      key={i}
                      icon={i < review.rating ? 'RiStarFill' : 'RiStarLine'}
                      className={
                        i < review.rating
                          ? 'text-chip-warning-text size-4'
                          : 'text-disabled size-4'
                      }
                    />
                  ))}
                </div>
              }
            />
            <DetailField
              label={t.detail.submittedAt}
              value={review.createdAt ? formatDate(review.createdAt) : '—'}
            />
          </div>

          <DetailField
            label={t.detail.comment}
            value={
              review.title ? (
                <>
                  <span className="font-medium">{review.title}</span>
                  <br />
                  {review.comment}
                </>
              ) : (
                review.comment
              )
            }
          />
        </div>
      )}
    </Modal>
  )
}
