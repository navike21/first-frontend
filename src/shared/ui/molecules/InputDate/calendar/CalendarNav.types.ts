export interface CalendarNavProps {
  onPrev: () => void
  onNext: () => void
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
  label: string
  onLabelClick?: () => void
}
