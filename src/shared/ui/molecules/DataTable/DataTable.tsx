import clsx from 'clsx'
import { IconButton } from '../../atoms/IconButton'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Spinner } from '../../atoms/Spinner'
import type { DataTableProps } from './DataTable.types'

/**
 * Domain-agnostic table: pass `columns` (header + cell renderer) and `rows`.
 * Supports API pagination (pass `pagination`) or rendering the full list
 * ("all records" mode, omit `pagination`). Loading and empty states built in.
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

  const showFooter = Boolean(totalLabel) || Boolean(pagination)

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--surface) shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={clsx(
                'text-left',
                'border-b border-(--border-subtle) bg-(--surface-subtle) text-xs font-semibold tracking-wide text-(--text-secondary) uppercase'
              )}
            >
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
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={clsx(
                  'duration-fast ease-out-expo transition-colors',
                  'hover:bg-(--surface-subtle)'
                )}
              >
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
            ))}
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
