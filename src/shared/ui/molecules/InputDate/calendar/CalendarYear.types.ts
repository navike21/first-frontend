export interface CalendarYearProps {
  selected?: Date
  yearPage: number[]
  onPageChange: (newCenter: number) => void
  onSelect: (year: number) => void
  minDate?: string
  maxDate?: string
}
