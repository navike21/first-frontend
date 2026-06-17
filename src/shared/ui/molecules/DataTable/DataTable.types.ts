import type { ReactNode } from 'react'
import type { IconName } from '@/shared/types/icons'

/** A single column definition for {@link DataTable}. */
export interface DataTableColumn<T> {
  /** Stable identifier, also used as the React key for header/cells. */
  id: string
  /** Header content (already localized by the caller). */
  header: ReactNode
  /** Horizontal alignment for the header cell and body cells. */
  align?: 'left' | 'right'
  /** Renders the cell content for a given row. */
  cell: (row: T) => ReactNode
  /** Extra classes for the header cell. */
  headerClassName?: string
  /** Extra classes for the body cells. */
  cellClassName?: string
}

/** Page controls for {@link DataTable}. Omit it for "all records" mode. */
export interface DataTablePagination {
  page: number
  pages: number
  onPageChange: (page: number) => void
  prevLabel: string
  nextLabel: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Returns a stable key for each row. */
  getRowKey: (row: T) => string
  isLoading?: boolean
  /** Icon shown in the empty state. */
  emptyIcon: IconName
  /** Label shown in the empty state. */
  emptyLabel: string
  /**
   * Footer summary (e.g. "12 users"). Shown whenever provided, both in
   * API-paginated and full-list modes. Omit to hide the summary.
   */
  totalLabel?: string
  /**
   * When provided, renders page controls (API pagination). Omit to render the
   * whole `rows` collection without paging ("all records" mode).
   */
  pagination?: DataTablePagination
  className?: string

  /** Enable a leading checkbox column for row selection. */
  selectable?: boolean
  /** Controlled set of selected row keys (from `getRowKey`). */
  selectedIds?: string[]
  /** Called with the next selection when a row or the header toggles. */
  onSelectionChange?: (ids: string[]) => void
  /** Accessible label for the header "select all" checkbox. */
  selectAllLabel?: string
  /** Accessible label for each row checkbox. */
  selectRowLabel?: string
}
