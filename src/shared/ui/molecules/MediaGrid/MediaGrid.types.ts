import type { ReactNode } from 'react'
import type { IconName } from '@/shared/types/icons'

/** Page controls for {@link MediaGrid}. Omit it for "all records" mode. */
export interface MediaGridPagination {
  page: number
  pages: number
  onPageChange: (page: number) => void
  prevLabel: string
  nextLabel: string
}

export interface MediaGridProps<T> {
  items: T[]
  /** Returns a stable key for each item. */
  getItemKey: (item: T) => string
  /** Renders the card content for a given item (thumbnail, name, actions…). */
  renderItem: (item: T) => ReactNode
  isLoading?: boolean
  /** Icon shown in the empty state. */
  emptyIcon: IconName
  /** Label shown in the empty state. */
  emptyLabel: string
  /**
   * Footer summary (e.g. "12 files"). Shown whenever provided, both in
   * API-paginated and full-list modes. Omit to hide the summary.
   */
  totalLabel?: string
  /**
   * When provided, renders page controls (API pagination). Omit to render
   * the whole `items` collection without paging ("all records" mode).
   */
  pagination?: MediaGridPagination
  className?: string

  /** Enable a leading checkbox per card, plus a "select all" toggle. */
  selectable?: boolean
  /** Controlled set of selected item keys (from `getItemKey`). */
  selectedIds?: string[]
  /** Called with the next selection when an item or "select all" toggles. */
  onSelectionChange?: (ids: string[]) => void
  /** Accessible label for the "select all" checkbox. */
  selectAllLabel?: string
  /** Accessible label for each item's checkbox. */
  selectItemLabel?: string
}
