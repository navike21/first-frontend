import type { Locale } from 'date-fns'

export interface CalendarMonthProps {
  selected?: Date
  onSelect: (year: number, month: number) => void
  minDate?: string
  maxDate?: string
  locale: Locale
  onYearLabelClick?: () => void
  /** Overrides the initial year shown — used in drill-down to preserve the year selected from the year grid */
  displayYear?: number
}
