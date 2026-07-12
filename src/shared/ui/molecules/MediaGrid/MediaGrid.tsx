import clsx from 'clsx'
import { IconButton } from '../../atoms/IconButton'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Skeleton } from '../../atoms/Skeleton'
import { Spinner } from '../../atoms/Spinner'
import { Checkbox } from '../Checkbox'
import type { MediaGridPagination, MediaGridProps } from './MediaGrid.types'

const FALLBACK_SKELETON_COUNT = 8

interface PaginationFooterProps {
  totalLabel?: string
  pagination?: MediaGridPagination
  /** Disables prev/next while a page change is already in flight. */
  disabled?: boolean
}

const PaginationFooter = ({ totalLabel, pagination, disabled }: PaginationFooterProps) => {
  if (!totalLabel && !pagination) return null
  return (
    <div className="flex items-center justify-between text-sm text-secondary">
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
          <span className="px-2 font-medium text-foreground">
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

/**
 * Domain-agnostic thumbnail grid: pass `items` + `renderItem`. Same shape as
 * `DataTable` (pagination, loading/empty states, optional selection) but for
 * cards instead of rows — shared by the media library picker, the media
 * listing page and its trash page, so the grid itself is only built once.
 */
export const MediaGrid = <T,>({
  items,
  getItemKey,
  renderItem,
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
  selectItemLabel,
}: MediaGridProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="medium" />
      </div>
    )
  }

  // A page/filter change re-fetches while `items` still holds the previous
  // page (kept around so the grid doesn't flash empty) — without this, the
  // old page just sits there and then suddenly swaps once the new page
  // lands. Skeletons make the in-between wait visible instead of looking stuck.
  if (isFetching) {
    return (
      <div className={clsx('flex flex-col gap-4', className)}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: items.length || FALLBACK_SKELETON_COUNT }, (_, i) => (
            <Skeleton key={i} variant="rect" className="aspect-square w-full" />
          ))}
        </div>
        <PaginationFooter totalLabel={totalLabel} pagination={pagination} disabled />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted">
        <IconComponent icon={emptyIcon} className="h-10 w-10" />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    )
  }

  const selected = selectedIds ?? []
  const itemKeys = items.map(getItemKey)
  const allSelected = itemKeys.length > 0 && itemKeys.every((k) => selected.includes(k))
  const someSelected = !allSelected && itemKeys.some((k) => selected.includes(k))

  const toggleItem = (key: string) => {
    if (!onSelectionChange) return
    onSelectionChange(
      selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key],
    )
  }

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(selected.filter((k) => !itemKeys.includes(k)))
    } else {
      const next = new Set(selected)
      itemKeys.forEach((k) => next.add(k))
      onSelectionChange([...next])
    }
  }

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      {selectable && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={toggleAll}
            aria-label={selectAllLabel}
          />
          <span className="text-xs text-muted">{selectAllLabel}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => {
          const key = getItemKey(item)
          const isSelected = selected.includes(key)
          return (
            <div key={key} className="relative">
              {selectable && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleItem(key)}
                    aria-label={selectItemLabel}
                  />
                </div>
              )}
              {renderItem(item)}
            </div>
          )
        })}
      </div>

      <PaginationFooter totalLabel={totalLabel} pagination={pagination} />
    </div>
  )
}
