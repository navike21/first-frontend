import type { DateRange, Matcher } from 'react-day-picker'
import type { Locale } from 'date-fns'

export interface CalendarRangeProps {
  selected?: DateRange
  onSelect: (range: DateRange | undefined) => void
  displayMonth?: Date
  onMonthChange?: (month: Date) => void
  disabled?: Matcher | Matcher[]
  locale?: Locale
  onMonthLabelClick?: () => void
  onYearLabelClick?: (year: number) => void
}
