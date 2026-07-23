import clsx from 'clsx'
import { IconButton } from '../../atoms/IconButton'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Skeleton } from '../../atoms/Skeleton'
import { Spinner } from '../../atoms/Spinner'
import { Checkbox } from '../Checkbox'
import type {
  DataTableColumn,
  DataTablePagination,
  DataTableProps,
} from './DataTable.types'

const FALLBACK_SKELETON_ROWS = 5

interface PaginationFooterProps {
  totalLabel?: string
  pagination?: DataTablePagination
  /** Disables prev/next while a page change is already in flight. */
  disabled?: boolean
}

const PaginationFooter = ({
  totalLabel,
  pagination,
  disabled,
}: PaginationFooterProps) => {
  if (!totalLabel && !pagination) return null
  return (
    <div className="text-secondary flex items-center justify-between text-sm">
      <span>{totalLabel}</span>
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center gap-1">
          <IconButton
            icon="RiArrowLeftSLine"
            variant="text"
            size="small"
            aria-label={pagination.prevLabel}
            disabled={disabled || pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          />
          <span className="text-foreground px-2 font-medium">
            {pagination.page} / {pagination.pages}
          </span>
          <IconButton
            icon="RiArrowRightSLine"
            variant="text"
            size="small"
            aria-label={pagination.nextLabel}
            disabled={disabled || pagination.page >= pagination.pages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          />
        </div>
      )}
    </div>
  )
}

// Mobile (card) layout and the desktop table both classify columns by their
// `mobile` role, with sensible fallbacks so tables work without extra config
// — the first column becomes the card title and any right-aligned column
// becomes the footer. Shared by the real render and the skeleton so both
// stay in sync.
function classifyColumns<T>(columns: DataTableColumn<T>[]) {
  const explicitPrimary = columns.find((col) => col.mobile === 'primary')
  const primaryColumn = explicitPrimary ?? columns[0]
  const footerColumns = columns.filter((col) =>
    col.mobile ? col.mobile === 'footer' : col.align === 'right'
  )
  const bodyColumns = columns.filter(
    (col) =>
      col !== primaryColumn &&
      !footerColumns.includes(col) &&
      col.mobile !== 'hidden'
  )
  return { primaryColumn, bodyColumns, footerColumns }
}

// Height of the tallest content a cell typically holds (an Avatar `sm` or an
// IconButton `small`, both 32px) — every skeleton cell reserves this much
// space so the skeleton row is the same height as the real row it stands in
// for, instead of collapsing to the skeleton bar's own shorter line-height.
const CELL_CONTENT_HEIGHT = 'h-8'

interface DataTableSkeletonProps<T> {
  columns: DataTableColumn<T>[]
  rowCount: number
  selectable: boolean
  totalLabel?: string
  pagination?: DataTablePagination
  className?: string
}

const DataTableSkeleton = <T,>({
  columns,
  rowCount,
  selectable,
  totalLabel,
  pagination,
  className,
}: DataTableSkeletonProps<T>) => {
  const { bodyColumns, footerColumns } = classifyColumns(columns)

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <ul className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: rowCount }, (_, i) => (
          <li
            key={i}
            className="border-border bg-surface rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              {selectable && (
                <Skeleton variant="rect" width={18} height={18} />
              )}
              <div className={clsx('flex flex-1 items-center', CELL_CONTENT_HEIGHT)}>
                <Skeleton variant="text" width="55%" />
              </div>
            </div>

            {bodyColumns.length > 0 && (
              <div className="border-border-subtle mt-3 flex flex-col gap-2 border-t pt-3">
                {bodyColumns.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="35%" />
                  </div>
                ))}
              </div>
            )}

            {footerColumns.length > 0 && (
              <div
                className={clsx(
                  'border-border-subtle mt-3 flex items-center justify-end gap-1 border-t pt-2',
                  CELL_CONTENT_HEIGHT
                )}
              >
                <Skeleton variant="rect" width={32} height={32} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="border-border bg-surface hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border-subtle bg-surface-subtle text-secondary border-b text-xs font-semibold tracking-wide uppercase">
              {selectable && <th className="w-px px-4 py-3" />}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={clsx(
                    'px-4 py-3 text-left',
                    col.align === 'right' && 'text-right'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border-control divide-y">
            {Array.from({ length: rowCount }, (_, i) => (
              <tr key={i}>
                {selectable && (
                  <td className="px-4 py-3">
                    <div
                      className={clsx('flex items-center', CELL_CONTENT_HEIGHT)}
                    >
                      <Skeleton variant="rect" width={18} height={18} />
                    </div>
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.id} className="px-4 py-3">
                    <div
                      className={clsx('flex items-center', CELL_CONTENT_HEIGHT)}
                    >
                      <Skeleton
                        variant="text"
                        width={col.align === 'right' ? '40%' : '70%'}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        totalLabel={totalLabel}
        pagination={pagination}
        disabled
      />
    </div>
  )
}

/**
 * Domain-agnostic table: pass `columns` (header + cell renderer) and `rows`.
 * Supports API pagination (pass `pagination`) or rendering the full list
 * ("all records" mode, omit `pagination`), and optional row selection
 * (`selectable` + controlled `selectedIds`/`onSelectionChange`). Loading and
 * empty states built in.
 */
export const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  isFetching = false,
  emptyIcon,
  emptyLabel,
  totalLabel,
  pagination,
  className,
  selectable = false,
  selectedIds,
  onSelectionChange,
  selectAllLabel,
  selectRowLabel,
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="medium" />
      </div>
    )
  }

  // A page/filter change re-fetches while `rows` still holds the previous
  // page (kept via the query's placeholderData, so the table doesn't flash
  // empty) — without this, the old page just sits there and then suddenly
  // swaps once the new page lands. Skeleton rows make the in-between wait
  // visible instead of looking stuck (same pattern as `MediaGrid`).
  if (isFetching) {
    return (
      <DataTableSkeleton
        columns={columns}
        rowCount={rows.length || FALLBACK_SKELETON_ROWS}
        selectable={selectable}
        totalLabel={totalLabel}
        pagination={pagination}
        className={className}
      />
    )
  }

  if (rows.length === 0) {
    return (
      <div className="text-muted flex flex-col items-center justify-center gap-2 py-20">
        <IconComponent icon={emptyIcon} className="h-10 w-10" />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    )
  }

  const selected = selectedIds ?? []
  const rowKeys = rows.map(getRowKey)
  const allSelected =
    rowKeys.length > 0 && rowKeys.every((k) => selected.includes(k))
  const someSelected = !allSelected && rowKeys.some((k) => selected.includes(k))

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return
    onSelectionChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    )
  }

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(selected.filter((k) => !rowKeys.includes(k)))
    } else {
      const next = new Set(selected)
      rowKeys.forEach((k) => next.add(k))
      onSelectionChange([...next])
    }
  }

  const { primaryColumn, bodyColumns, footerColumns } =
    classifyColumns(columns)

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      {/* Mobile: one card per row (table collapses below `md`). */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => {
          const key = getRowKey(row)
          const isSelected = selected.includes(key)
          return (
            <li
              key={key}
              className={clsx(
                'rounded-xl border p-4',
                'duration-fast ease-out-expo transition-colors',
                isSelected
                  ? 'border-primary-700 bg-surface-subtle'
                  : 'border-border bg-surface'
              )}
            >
              <div className="flex items-start gap-3">
                {selectable && (
                  <span className="pt-0.5">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(key)}
                      aria-label={selectRowLabel}
                    />
                  </span>
                )}
                {primaryColumn && (
                  <div className="min-w-0 flex-1">
                    {primaryColumn.cell(row)}
                  </div>
                )}
              </div>

              {bodyColumns.length > 0 && (
                <dl className="border-border-subtle mt-3 flex flex-col gap-2 border-t pt-3">
                  {bodyColumns.map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt className="text-secondary text-xs font-semibold tracking-wide uppercase">
                        {col.header}
                      </dt>
                      <dd className="text-foreground min-w-0 text-right text-sm">
                        {col.cell(row)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {footerColumns.length > 0 && (
                <div className="border-border-subtle mt-3 flex items-center justify-end gap-1 border-t pt-2">
                  {footerColumns.map((col) => (
                    <div key={col.id}>{col.cell(row)}</div>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Desktop: classic table with horizontal scroll fallback. */}
      <div className="border-border bg-surface hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={clsx(
                'text-left',
                'border-border-subtle bg-surface-subtle text-secondary border-b text-xs font-semibold tracking-wide uppercase'
              )}
            >
              {selectable && (
                <th className="w-px px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label={selectAllLabel}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={clsx(
                    'px-4 py-3',
                    col.align === 'right' && 'text-right',
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border-control divide-y">
            {rows.map((row) => {
              const key = getRowKey(row)
              const isSelected = selected.includes(key)
              return (
                <tr
                  key={key}
                  className={clsx(
                    'duration-fast ease-out-expo transition-colors',
                    isSelected
                      ? 'bg-surface-hover-row'
                      : 'hover:bg-surface-hover-row'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        aria-label={selectRowLabel}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={clsx(
                        'px-4 py-3',
                        col.align === 'right' && 'text-right',
                        col.cellClassName
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <PaginationFooter totalLabel={totalLabel} pagination={pagination} />
    </div>
  )
}
