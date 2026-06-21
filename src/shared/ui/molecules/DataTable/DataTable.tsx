import clsx from 'clsx'
import { IconButton } from '../../atoms/IconButton'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Spinner } from '../../atoms/Spinner'
import { Checkbox } from '../Checkbox'
import type { DataTableProps } from './DataTable.types'

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

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-(--text-muted)">
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

  const showFooter = Boolean(totalLabel) || Boolean(pagination)

  // Mobile (card) layout: classify columns by their `mobile` role, with
  // sensible fallbacks so tables work without extra config — the first column
  // becomes the card title and any right-aligned column becomes the footer.
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
                'rounded-xl border p-4 shadow-sm',
                'duration-fast ease-out-expo transition-colors',
                isSelected
                  ? 'border-primary-700 bg-(--surface-subtle)'
                  : 'border-(--border) bg-(--surface)'
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
                  <div className="min-w-0 flex-1">{primaryColumn.cell(row)}</div>
                )}
              </div>

              {bodyColumns.length > 0 && (
                <dl className="mt-3 flex flex-col gap-2 border-t border-(--border-subtle) pt-3">
                  {bodyColumns.map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt className="text-xs font-semibold tracking-wide text-(--text-secondary) uppercase">
                        {col.header}
                      </dt>
                      <dd className="min-w-0 text-right text-sm text-(--text-primary)">
                        {col.cell(row)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {footerColumns.length > 0 && (
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-(--border-subtle) pt-2">
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
      <div className="hidden overflow-x-auto rounded-xl border border-(--border) bg-(--surface) shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={clsx(
                'text-left',
                'border-b border-(--border-subtle) bg-(--surface-subtle) text-xs font-semibold tracking-wide text-(--text-secondary) uppercase'
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
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.map((row) => {
              const key = getRowKey(row)
              const isSelected = selected.includes(key)
              return (
                <tr
                  key={key}
                  className={clsx(
                    'duration-fast ease-out-expo transition-colors',
                    isSelected
                      ? 'bg-(--surface-subtle)'
                      : 'hover:bg-(--surface-subtle)'
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

      {showFooter && (
        <div className="flex items-center justify-between text-sm text-(--text-secondary)">
          <span>{totalLabel}</span>
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center gap-1">
              <IconButton
                icon="RiArrowLeftSLine"
                variant="text"
                size="small"
                aria-label={pagination.prevLabel}
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              />
              <span className="px-2 font-medium text-(--text-primary)">
                {pagination.page} / {pagination.pages}
              </span>
              <IconButton
                icon="RiArrowRightSLine"
                variant="text"
                size="small"
                aria-label={pagination.nextLabel}
                disabled={pagination.page >= pagination.pages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
