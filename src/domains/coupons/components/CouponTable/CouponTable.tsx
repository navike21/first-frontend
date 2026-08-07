import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { useCouponsTranslation } from '../../i18n'
import type { Coupon } from '../../model/coupon.types'

interface CouponTableProps {
  coupons: Coupon[]
  currency: string
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (coupon: Coupon) => void
  onEdit: (coupon: Coupon) => void
  onDelete: (coupon: Coupon) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const CouponTable = ({
  coupons,
  currency,
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
}: CouponTableProps) => {
  const { t, language } = useCouponsTranslation()

  const valueFor = (coupon: Coupon): string =>
    coupon.type === 'percentage'
      ? `${coupon.value}%`
      : formatCurrency(coupon.value, currency, language)

  const usageFor = (coupon: Coupon): string =>
    coupon.usageLimitTotal
      ? `${coupon.timesUsed} / ${coupon.usageLimitTotal}`
      : String(coupon.timesUsed)

  const columns: DataTableColumn<Coupon>[] = [
    {
      id: 'code',
      header: t.table.colCode,
      cell: (coupon) => (
        <span className="text-foreground font-mono font-medium">
          {coupon.code}
        </span>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (coupon) => t.type[coupon.type],
    },
    {
      id: 'value',
      header: t.table.colValue,
      cellClassName: 'text-secondary',
      cell: (coupon) => valueFor(coupon),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (coupon) => (
        <Chip size="small" variant={coupon.status === 'active' ? 'success' : 'default'}>
          {coupon.status === 'active' ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'usage',
      header: t.table.colUsage,
      cellClassName: 'text-secondary',
      cell: (coupon) => usageFor(coupon),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (coupon) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCoupon} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCoupon}
              onClick={() => onView(coupon)}
            />
          </Tooltip>
          <Can anyOf={CAN.couponsUpdate}>
            <Tooltip heading={t.table.editCoupon} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editCoupon}
                onClick={() => onEdit(coupon)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.couponsDelete}>
            <Tooltip heading={t.table.deleteCoupon} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteCoupon}
                onClick={() => onDelete(coupon)}
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
      rows={coupons}
      getRowKey={(coupon) => coupon.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiCoupon3Line"
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
