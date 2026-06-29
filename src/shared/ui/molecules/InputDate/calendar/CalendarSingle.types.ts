import type { Matcher } from 'react-day-picker'
import type { Locale } from 'date-fns'

export interface CalendarSingleProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  displayMonth?: Date
  onMonthChange?: (month: Date) => void
  disabled?: Matcher | Matcher[]
  locale?: Locale
  onMonthLabelClick?: () => void
  onYearLabelClick?: (year: number) => void
}
